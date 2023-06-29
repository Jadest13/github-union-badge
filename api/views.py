import locale
import logging
import qrcode
import base64
from io import BytesIO

from django.http import HttpResponse
from .theme.theme import Themes

locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')

logger = logging.getLogger('testlogger')

class UrlSettings(object):
    def __init__(self, request, MAX_LEN):
        self.union = request.GET.get("union", "union")
        self.name = request.GET.get("name", "name")
        self.desc = request.GET.get("desc", "desc")
        self.info_url = request.GET.get("info_url", "info_url")

def union_badge(request):
    MAX_LEN = 11
    url_set = UrlSettings(request, MAX_LEN)
    
    qr = qrcode.QRCode(
        box_size=12,
        border=0
    )
    qr.add_data(url_set.info_url)
    qr.make()
    qrcode_img = qr.make_image(fill_color=Themes[url_set.union]['desc_color'], back_color=Themes[url_set.union]['secondary_bg'])
    buffered = BytesIO()
    qrcode_img.save(buffered, format="PNG")
    qrcode_string = "data:image/png;base64,"+base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    logo_string = "data:image/png;base64,"+base64.b64encode(open(f"./api/theme/logo/{Themes[url_set.union]['logo']}", "rb").read()).decode("utf-8")
    
    svg = '''
    <!DOCTYPE svg PUBLIC
        "-//W3C//DTD SVG 1.1//EN"
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg height="1024" width="682"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve">
    <style type="text/css">
        <![CDATA[
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
            .background {{
                fill: url(#grad);
                stroke:{border_color};
                stroke-width:8px;
            }}
            text {{
                font-family: 'Noto Sans KR', sans-serif;
            }}
            .union_name {{
                font-weight: 700;
                font-size: 108px;
                fill: {title_color};
            }}
            .name {{
                font-weight: 900;
                font-size: 69px;
                fill: {desc_color};
            }}
            .desc {{
                font-weight: 600;
                font-size: 40px;
                fill: {desc_color};
            }}
            .info_url {{
                font-weight: 600;
                font-size: 24px;
                fill: {desc_color};
            }}
        ]]>
    </style>
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:{primary_bg};stop-opacity:1"></stop>
            <stop offset="20%" style="stop-color:{primary_bg};stop-opacity:1"></stop>
            <stop offset="75%" style="stop-color:{secondary_bg};stop-opacity:1"></stop>
            <stop offset="100%" style="stop-color:{secondary_bg};stop-opacity:1"></stop>
        </linearGradient>
    </defs>
    <rect x="4px" y="4" width="674" height="1016" rx="30" ry="30" class="background"/>
    <text x="50%" y="120" width="620" height="160" dominant-baseline="middle" text-anchor="middle" class="union_name">{school}</text>
    <image href="{union_img_link}" x="50%" y="380" height="320" width="320" transform="translate(-160,-160)" class="tier-title"/>
    <text x="50%" y="645" width="620" height="50" dominant-baseline="middle" text-anchor="middle" class="name">{name}</text>
    <text x="50%" y="715" width="620" height="50" dominant-baseline="middle" text-anchor="middle" class="desc">{desc}</text>
    <image href="{qrcode}" x="50%" y="847.5" height="175" width="175" transform="translate(-87.5,-87.5)" class="tier-title"/>
    <text x="50%" y="980" width="620" height="80" dominant-baseline="middle" text-anchor="middle" class="info_url">{info_url}</text>
</svg>
    '''.format(
        school=Themes[url_set.union]['title'],
        name=url_set.name,
        desc=url_set.desc,
        info_url=url_set.info_url,
        union_img_link=logo_string,
        qrcode=qrcode_string,
        primary_bg=Themes[url_set.union]['primary_bg'],
        secondary_bg=Themes[url_set.union]['secondary_bg'],
        title_color=Themes[url_set.union]['title_color'],
        desc_color=Themes[url_set.union]['desc_color'],
        border_color=Themes[url_set.union]['border_color']
        )

    logger.info(f'[/union_badge] union: {url_set.union}, name: {url_set.name}, desc: {url_set.desc}, info_url: {url_set.info_url}')
    response = HttpResponse(content=svg)
    response['Content-Type'] = 'image/svg+xml'
    response['Cache-Control'] = 'max-age=3600'

    return response
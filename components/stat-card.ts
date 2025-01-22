interface textInfo {
  text: string;
  color: string;
}

class SVGText {
  text: string;
  color: string;
  y: number;
  size: number;
  weight: number;

  constructor({
    text = "text",
    y = 0.5,
    size = 1,
    color = "#000000",
    weight = 600,
  }) {
    this.text = text;
    this.color = color;
    this.y = y;
    this.size = size;
    this.weight = weight;
  }

  getElement() {
    return `
      <text
        x="50%" y="${this.y}%"
        dominant-baseline="middle"
        text-anchor="middle" 
        style="font-size: ${this.size}rem; font-weight: ${this.weight}; fill: ${this.color};">
        ${this.text}
      </text>
    `;
  }
}

class Card {
  width: number;
  height: number;
  logo: string;

  pri_bg: string;
  sec_bg: string;
  title_color: string;
  desc_color: string;
  border_color: string;

  unionInfo: textInfo;
  nameInfo: textInfo;
  descInfo: textInfo;
  urlInfo: textInfo;

  unionText: SVGText;
  nameText: SVGText;
  descText: SVGText;
  urlText: SVGText;

  qrcode: string;

  constructor({
    width = 720,
    height = 1080,
    logo = "https://github.com/Jadest13/github-union-badge/blob/master/api/theme/logo/SOONGSIL.png?raw=true",
    pri_bg = "#00B3FF",
    sec_bg = "#FFFFFF",
    title_color = "#FFFFFF",
    desc_color = "#00B3FF",
    border_color = "#F00FFF",
    unionInfo = { text: "", color: "#000000" },
    nameInfo = { text: "", color: "#000000" },
    descInfo = { text: "", color: "#000000" },
    urlInfo = { text: "", color: "#000000" },
    qrcode = "",
  }) {
    this.width = width;
    this.height = height;
    this.pri_bg = pri_bg;
    this.sec_bg = sec_bg;
    this.title_color = title_color;
    this.desc_color = desc_color;
    this.border_color = border_color;
    this.logo =
      "https://raw.githubusercontent.com/Jadest13/github-union-badge/master/themes/logo/" +
      logo;

    this.unionInfo = unionInfo;
    this.nameInfo = nameInfo;
    this.descInfo = descInfo;
    this.urlInfo = urlInfo;
    this.qrcode = qrcode;

    this.unionText = new SVGText({
      text: this.unionInfo.text,
      color: this.unionInfo.color,
      y: 11,
      weight: 900,
      size: 3,
    });

    this.nameText = new SVGText({
      text: this.nameInfo.text,
      color: this.nameInfo.color,
      y: 60,
      weight: 900,
      size: 2,
    });

    this.descText = new SVGText({
      text: this.descInfo.text,
      color: this.descInfo.color,
      y: 66,
      weight: 600,
      size: 1.25,
    });

    this.urlText = new SVGText({
      text: this.urlInfo.text,
      color: this.urlInfo.color,
      y: 91,
      weight: 600,
      size: 0.75,
    });
  }

  getStyles: any = () => {
    return `
      <style type="text/css">
        <![CDATA[
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
          .background {
            fill: url(#grad);
            stroke: ${this.border_color};
            stroke-width: 8px;
          }
          svg {
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 32px;
          }
        ]]>
      </style>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${this.pri_bg};stop-opacity:1"></stop>
            <stop offset="20%" style="stop-color:${this.pri_bg};stop-opacity:1"></stop>
            <stop offset="75%" style="stop-color:${this.sec_bg};stop-opacity:1"></stop>
            <stop offset="100%" style="stop-color:${this.sec_bg};stop-opacity:1"></stop>
        </linearGradient>
      </defs>
    `;
  };

  render(body) {
    return `
      <!DOCTYPE svg PUBLIC
        "-//W3C//DTD SVG 1.1//EN"
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg
        width="${this.width}" height="${this.height}"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xml:space="preserve"
        fill="none"
        role="img"
        aria-labelledby="descId"
      >
        ${this.getStyles()}
        <rect x="4px" y="4" width="${this.width - 8}" height="${
      this.height - 8
    }" rx="30" ry="30" class="background"/>
        
        
        <image xlink:href="${
          this.logo
        }" x="50%" y="380" height="320" width="320" transform="translate(-160,-160)" class="tier-title"/>
        

        <image xlink:href="${
          this.qrcode
        }" x="50%" y="847.5" height="175" width="175" transform="translate(-87.5,-87.5)" class="Z"/>
        
        ${this.unionText.getElement()}
        ${this.nameText.getElement()}
        ${this.descText.getElement()}
        ${this.urlText.getElement()}
      </svg>
    `;
  }
}

const renderStatsCard = (options) => {
  const { size } = options;

  const card = new Card(options);

  return card.render(
    `
      <svg x="0" y="0">
        <image href="http://qrcode.kaywa.com/img.php?d=https://www.happyjung.com?c1=3D1%26c2=2%26c3=3" x="50%" y="847.5" height="175" width="175" transform="translate(-87.5,-87.5)" class="tier-title"/>
      </svg>
    `
  );
};

export { renderStatsCard };
export default renderStatsCard;

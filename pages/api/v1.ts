import type { NextApiRequest, NextApiResponse } from "next";
import { themes } from "../../themes/index";
const QRCode = require("qrcode");

type ResponseData = {
  message: string;
};

const tmp = (props) => {
  return `
    <!DOCTYPE svg PUBLIC
      "-//W3C//DTD SVG 1.1//EN"
      "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg width="640" height="1080" viewBox="0 0 640 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="632" height="1072" rx="28" fill="url(#paint0_linear_401_2)"/>
      <rect x="4" y="4" width="632" height="1072" rx="28" stroke="${props.border_color}" stroke-width="8"/>

      <foreignObject class="logo" x="50%" y="400" width="320" height="320" transform="translate(-160,-160)">
        ${props.logoSVG}
      </foreignObject>
      
      <foreignObject class="qrcode" x="50%" y="910" width="160" height="160" transform="translate(-80,-80)">
        ${props.qrcodeSVG}
      </foreignObject>
      
      <text
        x="50%" y="100"
        dominant-baseline="middle"
        text-anchor="middle" 
        style="
          font-weight: 900;
          fill: ${props.title_color};
          font-family: 'Roboto';
          font-size: 96px;
        ">
      ${props.title}
      </text>

      <text
        x="50%" y="710"
        dominant-baseline="middle"
        text-anchor="middle" 
        style="
          font-weight: 900;
          fill: ${props.desc_color};
          font-family: 'Roboto';
          font-size: 64px;
        ">
        ${props.username}
      </text>

      <text
        x="50%" y="790"
        dominant-baseline="middle"
        text-anchor="middle" 
        style="
          font-weight: 500;
          fill: ${props.desc_color};
          font-family: 'Roboto';
          font-size: 48px;
        ">
        ${props.desc}
      </text>

      <text
        x="50%" y="1030"
        dominant-baseline="middle"
        text-anchor="middle" 
          style="font-weight: 100;
          fill: ${props.desc_color};
          font-family: 'Roboto';
          font-size: 24px;
        ">
        ${props.url}
      </text>

      <defs>
        <linearGradient id="paint0_linear_401_2" x1="320" y1="0" x2="320" y2="1080" gradientUnits="userSpaceOnUse">
          <stop offset="0.2" stop-color="${props.primary_bg}"/>
          <stop offset="0.75" stop-color="${props.secondary_bg}"/>
        </linearGradient>
        <clipPath id="clip0_401_2">
        <rect width="320" height="320" fill="white" transform="translate(160 256.625)"/>
        </clipPath>
          <clipPath id="clip1_401_2">
          <rect width="640" height="394.75" fill="white" transform="translate(0 661.25)"/>
        </clipPath>
        <style type="text/css">
          <![CDATA[
            @import url(https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap);
            @import url(https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap);
            @import url(https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap);
            .logo > svg {
              fill: ${props.title_color};
            }
            .qrcode > svg {
              stroke: ${props.desc_color};
            }
          ]]>
        </style>
      </defs>
    </svg>
  `;
};

function svgCmd(cmd, x, y?) {
  let str = cmd + x;
  if (typeof y !== "undefined") str += " " + y;

  return str;
}

function qrToPath(data, size, margin) {
  let path = "";
  let moveBy = 0;
  let newRow = false;
  let lineLength = 0;

  for (let i = 0; i < data.length; i++) {
    const col = Math.floor(i % size);
    const row = Math.floor(i / size);

    if (!col && !newRow) newRow = true;

    if (data[i]) {
      lineLength++;

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow
          ? svgCmd("M", col + margin, 0.5 + row + margin)
          : svgCmd("m", moveBy, 0);

        moveBy = 0;
        newRow = false;
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd("h", lineLength);
        lineLength = 0;
      }
    } else {
      moveBy++;
    }
  }

  return path;
}

const QRCodeSVG = (url) => {
  if (!url) return null;

  const qrcode = QRCode.create(url, {
    errorCorrectionLevel: "H",
    maskPattern: 7,
  });
  const { data, size } = qrcode.modules;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">
    <path stroke="current" d="${qrToPath(data, size, 0)}"/>
  </svg>
  `;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | String>
) {
  const { unionname, username, desc, url } = req.query;

  const nowTheme = themes[unionname.toString().toLowerCase()];

  try {
    const logoSVG = await fetch(
      req.headers["x-forwarded-proto"] +
        "://" +
        req.headers["host"] +
        "/logos/" +
        nowTheme.logo
    ).then((response) => response.text());
    const qrcodeSVG = QRCodeSVG(url);

    const result = tmp({
      logoSVG: logoSVG,
      qrcodeSVG: qrcodeSVG ?? "",
      ...nowTheme,
      username: username ?? "",
      desc: desc ?? "",
      url: url ?? "",
    });

    await res.setHeader("Content-Type", "image/svg+xml");

    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: err + "asd" });
  }
}

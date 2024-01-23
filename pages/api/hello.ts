import type { NextApiRequest, NextApiResponse } from 'next'
import { renderStatsCard } from "../../components/stat-card"; 
import { themes } from "../../themes/index"; 

type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData|String>
) {
  
  const {
    unionname,
    username,
    desc,
    urlinfo,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "max-age=3600");

  const nowTheme = themes[unionname.toString()];

  try {
    const cardInfo = {
      unionInfo: {
        text: nowTheme.title,
        color: nowTheme.title_color,
      },
      nameInfo: {
        text: username,
        color: nowTheme.desc_color,
      },
      descInfo: {
        text: desc,
        color: nowTheme.desc_color,
      },
      urlInfo: {
        text: urlinfo,
        color: nowTheme.desc_color,
      },
      border_color: nowTheme.border_color,
      logo: nowTheme.logo,
      pri_bg: nowTheme.primary_bg,
      sec_bg: nowTheme.secondary_bg,
      size: 1,
    };
    return res.send(
      renderStatsCard(cardInfo)
    )
  } catch (err) {
    console.log(err)
    return res.status(200).json({ message: 'Hello from Next.js!' })
  }
}
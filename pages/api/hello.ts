import type { NextApiRequest, NextApiResponse } from 'next'
import { renderStatsCard } from "../../components/stat-card"; 
import { themes } from "../../themes/index"; 

type ResponseData = {
  message: string
}
 
const ONE_MINUTE = 60;
const FIVE_MINUTES = 300;
const TEN_MINUTES = 600;
const FIFTEEN_MINUTES = 900;
const THIRTY_MINUTES = 1800;
const TWO_HOURS = 7200;
const FOUR_HOURS = 14400;
const SIX_HOURS = 21600;
const EIGHT_HOURS = 28800;
const ONE_DAY = 86400;

const CONSTANTS = {
  ONE_MINUTE,
  FIVE_MINUTES,
  TEN_MINUTES,
  FIFTEEN_MINUTES,
  THIRTY_MINUTES,
  TWO_HOURS,
  FOUR_HOURS,
  SIX_HOURS,
  EIGHT_HOURS,
  ONE_DAY,
  CARD_CACHE_SECONDS: SIX_HOURS,
  ERROR_CACHE_SECONDS: TEN_MINUTES,
};

const clampValue = (number, min, max) => {
  // @ts-ignore
  if (Number.isNaN(parseInt(number, 10))) {
    return min;
  }
  return Math.max(min, Math.min(number, max));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData|String>
) {
  
  const {
    unionname,
    username,
    desc,
    urlinfo,
    cache_seconds,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  const nowTheme = themes[unionname.toString()];

  try {
    console.log(req.query);
    const cardInfo = await {
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

    let cacheSeconds = clampValue(
      // parseInt(cache_seconds || CONSTANTS.CARD_CACHE_SECONDS),
      CONSTANTS.SIX_HOURS,
      CONSTANTS.SIX_HOURS,
      CONSTANTS.ONE_DAY,
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      "Cache-Control",
      `max-age=${
        cacheSeconds / 2
      }, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );

    return res.send(
      await renderStatsCard(cardInfo)
    )
  } catch (err) {
    console.log(err)
    return res.status(200).json({ message: 'Hello from Next.js!' })
  }
}
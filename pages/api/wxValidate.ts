import sha1 from "sha1";
import type { NextApiRequest, NextApiResponse } from "next";
const WX_TOKEN = process.env.WX_TOKEN;
export interface WeixinSignatureParams {
  signature: string;
  timestamp: string;
  nonce: string;
  echostr: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const query = req.query as unknown as WeixinSignatureParams;
    const isValid = checkWeixinSignature(query);
    if (isValid) {
      return res.send(query.echostr);
    }
  }
  res.send(null);
}


export function checkWeixinSignature({
  signature,
  timestamp,
  nonce,
}: WeixinSignatureParams) {
  const arr = [WX_TOKEN, timestamp, nonce];
  arr.sort();
  const temp = sha1(arr.join(""));
  if (temp === signature) {
    return true;
  }
  return false;
}

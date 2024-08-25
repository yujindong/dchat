import type { NextApiRequest, NextApiResponse } from "next";

import sha1 from "sha1";
const WX_TOKEN = "test123";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const query = req.query as unknown as WeixinSignatureParams;
    const isValid = checkWeixinSignature(query);
    if (isValid) {
      return res.send(query.echostr);
    }
    // Handle any other HTTP method
  }
  res.send(null);
}

export interface WeixinSignatureParams {
  signature: string;
  timestamp: string;
  nonce: string;
  echostr: string;
}
export function checkWeixinSignature({
  signature,
  timestamp,
  nonce,
  echostr,
}: WeixinSignatureParams) {
  const arr = [WX_TOKEN, timestamp, nonce];
  arr.sort();
  const temp = sha1(arr.join(""));
  if (temp === signature) {
    return true;
  }
  return false;
}

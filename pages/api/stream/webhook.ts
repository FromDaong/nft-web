import { NextApiRequest } from "next";
// enable this webhook to set live

const livestream_hook = (req, res) => {
  const { body } = req;

  console.log({ body });

  res.status(200).json({ error: false });
};

const hook_signature_verify = (handler) => (req: NextApiRequest, res) => {
  const livepeer_signature: string = req.headers[
    "Livepeer-Signature"
  ] as string;

  const signature_elements = livepeer_signature.split(",");
  const signature_object = signature_elements.map((s) => {
    const [key, value] = s.split("=");
    return { [key]: value };
  });

  const signature_object_flat = Object.assign({}, ...signature_object);
  const { body } = req;

  console.log({ signature_object_flat, body, signature_elements });

  handler();
};

export default hook_signature_verify(livestream_hook);

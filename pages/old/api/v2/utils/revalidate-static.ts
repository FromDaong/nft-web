export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({ message: 'Invalid token' })
  // }

  try {
    const { id, secret } = req.body;
    if (!secret || secret !== process.env.VALIDATION_SECRET) {
      return res.status(401).json({ message: "Invalid token" });
    }
    await res.unstable_revalidate(`/nft/${id}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}

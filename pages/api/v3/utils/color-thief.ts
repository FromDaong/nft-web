import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';

 const colorThief = async (req: NextApiRequest, res: NextApiResponse) => {
    const {imageUrl} = req.body;

    res.status(200).json({
        dominatn: ""
    })
 }
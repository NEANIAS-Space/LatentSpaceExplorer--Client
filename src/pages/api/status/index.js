import getStatus from 'app/api/status';

export default async function handler(req, res) {
    try {
        const response = await getStatus();

        res.status(200).json({ ...response.data, client: true });
    } catch {
        res.status(200).json({
            server: false,
            queue: false,
            scheduler: false,
            client: true,
        });
    }
}

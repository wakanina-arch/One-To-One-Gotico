export default function handler(req, res) {
  res.status(200).json({ 
    status: 'Backend de One To One está activo ✅',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}

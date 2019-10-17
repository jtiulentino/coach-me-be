module.export = (req, res, next) => {
    if (req.body.clientPhone) {
        if (req.body.clientPhone.length === 10) {
            next();
        } else {
            res.status(422).json({ error: 'phone needs 10 digits' });
        }
        
      
    } else {
        res.status(404).json({ error: 'client phone number not found' });
    }
};

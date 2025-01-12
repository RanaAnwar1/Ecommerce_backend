
const { General, Contact } = require('../Models/general.model');
const userRoleModel = require('../Models/userRoles.model')
exports.getGeneral = async (req, res) => {
    try {
        const general = await General.find(); 
        res.status(200).json(general);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateGeneral = async (req, res) => {
    try {
        const auth = await isAuthenticated(req.user);
        if (auth) {
            const { about, hours, address, phone } = req.body;

            let general = await General.findOne(); // Use General model explicitly
            if (!general) {
                general = new General();
            }

            general.about = about || general.about;
            general.hours = hours || general.hours;
            general.address = address || general.address;
            general.phone = phone || general.phone;

            await general.save();
            res.status(200).json(general);
        } else {
            res.status(403).json({ error: "Unauthorized access" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getContact = async (req, res) => {
    try {
        const auth = await isAuthenticated(req.user);
        if (auth) {
            const contact = await Contact.find(); // Use Contact model explicitly
            res.status(200).json(contact);
        } else {
            res.status(403).json({ error: "Unauthorized access" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createContact = async (req, res) => {
    try {
        const auth = await isAuthenticated(req.user);
        if (!auth) {
            const { name, email, message } = req.body;
            const newContact = new Contact({ name, email, message }); // Use Contact model explicitly
            await newContact.save();
            res.status(201).json(newContact);
        } else {
            res.status(403).json({ error: "Unauthorized access" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function isAuthenticated(obj){
    const userRoleID = obj.userRole
    const userRole = await userRoleModel.findById(userRoleID)
    if(userRole.name === 'admin'){
        return true
    }
    else if(userRole.name === 'user'){
        return false
    }
}
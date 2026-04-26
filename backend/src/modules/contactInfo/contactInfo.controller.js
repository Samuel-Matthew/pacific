import ContactInfo from "./contactInfo.model.js";

/*
|--------------------------------------------------------------------------
| Get Contact Info (Public)
|--------------------------------------------------------------------------
*/

export const getContactInfo = async (req, res, next) => {
  try {
    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact information not found",
      });
    }

    // Return only non-empty fields
    const cleanedInfo = {};
    if (contactInfo.email) cleanedInfo.email = contactInfo.email;
    if (contactInfo.whatsapp) cleanedInfo.whatsapp = contactInfo.whatsapp;
    if (contactInfo.telegram) cleanedInfo.telegram = contactInfo.telegram;
    if (contactInfo.signal) cleanedInfo.signal = contactInfo.signal;
    if (contactInfo.phone) cleanedInfo.phone = contactInfo.phone;

    res.json({
      success: true,
      data: cleanedInfo,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Contact Info (Admin Only)
|--------------------------------------------------------------------------
*/

export const updateContactInfo = async (req, res, next) => {
  try {
    const { email, whatsapp, telegram, signal, phone } = req.body;

    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      contactInfo = new ContactInfo();
    }

    if (email !== undefined) contactInfo.email = email;
    if (whatsapp !== undefined) contactInfo.whatsapp = whatsapp;
    if (telegram !== undefined) contactInfo.telegram = telegram;
    if (signal !== undefined) contactInfo.signal = signal;
    if (phone !== undefined) contactInfo.phone = phone;

    await contactInfo.save();

    res.json({
      success: true,
      message: "Contact information updated successfully",
      data: contactInfo,
    });
  } catch (error) {
    next(error);
  }
};

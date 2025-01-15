const axios = require("axios");

let accessToken = "rw9PH76m8jX4SMUiIidbnBf1TYLE3yoxt2dCnooP";
let clientId = "62b182eea31d8d9863079f42";
let apiUrl = "https://academy.turiscool.com/admin/api/sso";





async function ssoLogin(req, res) {
  try {
    const response = await axios.post(apiUrl, req.body, {
      headers: {
        "Lw-Client": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error in ssoLogin:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}

module.exports = ssoLogin; // Ensure this is present

const sendMsg = msg => {
  const webhookUrl =
    'https://discordapp.com/api/webhooks/1189609106286313592/yrHlFFb0RKGxa-FJ9ziZ7niJuFvhHZST-nbRX4rWAZj1ZPLpqEHB3EXrfzI6BcLX7APE'; // Replace with your webhook URL

  const message = {
    content: msg,
  };

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
};

const getIp = async () => {
  const res = await fetch('https://api.ipify.org?format=json');
  const json = await res.json();
  return json.ip;
};

const getIpInfo = async () => {
  const ip = await getIp();
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const json = await res.json();

  // Add latitude and longitude to the result
  const latitude = json.latitude;
  const longitude = json.longitude;

  return { ...json, latitude, longitude };
};

function getBrowserInfo() {
  const browser = window.navigator.userAgent;
  const os = window.navigator.platform;
  const language = window.navigator.language;
  const cookiesEnabled = window.navigator.cookieEnabled;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  let plugins = window.navigator.plugins;
  let pluginsArray = [];
  for (let i = 0; i < plugins.length; i++) {
    pluginsArray.push(plugins[i].name);
  }
  pluginsArray = pluginsArray.join(', ');
  plugins = pluginsArray;


  let mimeTypes = window.navigator.mimeTypes;
  let mimeTypesArray = [];
  for (let i = 0; i < mimeTypes.length; i++) {
    mimeTypesArray.push(mimeTypes[i].type);
  }
  mimeTypesArray = mimeTypesArray.join(', ');
  mimeTypes = mimeTypesArray;

  return {
    browser,
    os,
    language,
    cookiesEnabled,
    screenResolution,
    plugins,
    mimeTypes,
  };
}

const setVisitRecord = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const today = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  const visitList = localStorage.getItem('visitList');
  if (visitList) {
    localStorage.setItem('visitList', `${visitList},${today}`);
  } else {
    localStorage.setItem('visitList', today);
  }
};

const getVisitRecord = () => {
  const visitList = localStorage.getItem('visitList');
  if (visitList) {
    const visitListArray = visitList.split(',');
    return visitListArray;
  } else { 
    return [];
  }
};

const getIpInfoAndSend = async () => {
  const ipInfo = await getIpInfo();
  const browserInfo = getBrowserInfo();
  let date = new Date();
  //format date to like this: 22h45
  date = `${date.getHours()}h${date.getMinutes()}`;
  const visitList = getVisitRecord();
  const filterd_out_orgs = ["MICROSOFT-CORP-MSN-AS-BLOCK", "AMAZON-AES", undefined]
  if (filterd_out_orgs.includes(ipInfo.org)) {
    return
  }
  const msg = `-------------------------------------------------
  :thumbsup: New visitor at **${date}**:
  -**Country:** ${ipInfo.country_name}
  -**Region:** ${ipInfo.region}
  -**City:** ${ipInfo.city}
  -**Latitude:** ${ipInfo.latitude}
  -**Longitude:** ${ipInfo.longitude}
  -**Languages:** ${ipInfo.languages}
  -**Currency:** ${ipInfo.currency_name}
  -**IP:** ${ipInfo.ip}
  -**ASN:** ${ipInfo.asn}
  -**ORG:** ${ipInfo.org}
  -**User agent:** ${browserInfo.browser}
  -**OS:** ${browserInfo.os}
  -**Language:** ${browserInfo.language}
  -**Cookies enabled:** ${browserInfo.cookiesEnabled}
  -**Screen resolution:** ${browserInfo.screenResolution}
  -**Plugins:** ${browserInfo.plugins || 'none'}
  -**Mime types:** ${browserInfo.mimeTypes || 'none'}
  -**Visit list:** ${visitList.join(', ') || 'none'}
  `;
  sendMsg(msg);
  setVisitRecord();
};

getIpInfoAndSend();

const process = require('process');

const baseUrlDev = `${process.env.BASE_URL}:${process.env.PORT}`;
const baseUrlProd = `${process.env.BASE_URL}:${process.env.PORT}`;

const websiteUrl = process.env.NODE_ENV === 'production' ? baseUrlProd : baseUrlDev;

module.exports = {
  websiteUrl,
};

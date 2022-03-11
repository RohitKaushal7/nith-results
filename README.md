# NITH Results

![forthebadge](https://forthebadge.com/images/badges/powered-by-electricity.svg)
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)
![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)
[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://nith.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/57fa7728-1628-4739-9549-f9faa7a86c82/deploy-status)](https://app.netlify.com/sites/nith/deploys)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-green.svg)
[![HitCount](http://hits.dwyl.io/RohitKaushal7/nith-results.svg)](http://hits.dwyl.io/RohitKaushal7/nith-results)

---

https://nith.netlify.app  
This is a [**Website**](https://nith.netlify.app/) to get your result in **NIT Hamirpur**. Check your full result and find your rank in the Class or College.

---

## How it works

Result data for every student is web scraped form the official NITH results college website via a python script which is stored in database and served via API.  
_[NITH Results API](https://github.com/rohithill/nithp)_ maintained by _[Rohit Hill](https://github.com/rohithill)_

## Features

- [x] View Results and Ranks in [ Class(batch+branch), year(batch), full_college ]
- [x] Search by roll number, name
- [x] Sort by CGPA or SGPA
- [x] Ranking scheme ( 1224, 1223, 1234 )
- [x] Full Result - Semester Wise -- subject wise result for particular student
- [x] Download as .csv
- [x] Dark Mode
- [x] Cache results
- [ ] Remember me

## Development

This is a React App. Requires NodeJs and npm installed.  
![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

- Install Ddependencies  
  `pnpm install`
- Start development server  
  `npm start`

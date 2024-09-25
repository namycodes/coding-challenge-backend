const User = require("./models/users");
const m2s = require('mongoose-to-swagger');
const options = {
    definition: {
      openapi: "3.1.0",
      components:{
        schemas: {
          user: m2s(User)
        }
    },
      info: {
        title: "Weather Web Application APIs",
        version: "0.1.0",
        description:
          "This is a documentation for the weather web application",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Namycodes",
          url: "https://namycodes.vercel.app",
          email: "namycodes@yahoo.com",
        },
      },
      servers: [
        {
          url: "http://localhost:8080",
        },
      ],
    },
    apis: ["./routes/users/*.js","./routes/weather/*.js"],
  };
module.exports =  {
    options
} 

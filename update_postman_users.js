const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'OctoberTuners.postman_collection.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const usersFolder = {
  name: "Users",
  item: [
    {
      name: "Get All Users (Admin)",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: {
          raw: "{{base_url}}/users?page=1&limit=10",
          host: ["{{base_url}}"],
          path: ["users"],
          query: [
            { key: "page", value: "1" },
            { key: "limit", value: "10" },
            { key: "sort", value: "-createdAt", disabled: true },
            { key: "role", value: "member", description: "Filter by role", disabled: true }
          ]
        }
      }
    },
    {
      name: "Get My Profile",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: "{{base_url}}/users/me"
      }
    },
    {
      name: "Get User By ID (Admin)",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: {
          raw: "{{base_url}}/users/:id",
          host: ["{{base_url}}"],
          path: ["users", ":id"],
          variable: [{ key: "id", value: "<user_id>" }]
        }
      }
    },
    {
      name: "Update My Profile",
      request: {
        method: "PUT",
        header: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer {{token}}" }
        ],
        url: "{{base_url}}/users/me",
        body: {
          mode: "raw",
          raw: "{\n  \"name\": \"Updated Name\"\n}"
        }
      }
    },
    {
      name: "Update User (Admin)",
      request: {
        method: "PUT",
        header: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer {{token}}" }
        ],
        url: {
          raw: "{{base_url}}/users/:id",
          host: ["{{base_url}}"],
          path: ["users", ":id"],
          variable: [{ key: "id", value: "<user_id>" }]
        },
        body: {
          mode: "raw",
          raw: "{\n  \"name\": \"Updated Name\",\n  \"role\": \"admin\"\n}"
        }
      }
    },
    {
      name: "Delete User (Admin)",
      request: {
        method: "DELETE",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: {
          raw: "{{base_url}}/users/:id",
          host: ["{{base_url}}"],
          path: ["users", ":id"],
          variable: [{ key: "id", value: "<user_id>" }]
        }
      }
    }
  ]
};

// Insert after Auth folder
const authIndex = data.item.findIndex(i => i.name === "Auth");
const insertAt = authIndex !== -1 ? authIndex + 1 : 1;
data.item.splice(insertAt, 0, usersFolder);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Postman collection updated with Users CRUD');

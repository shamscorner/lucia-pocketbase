/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5uy48evuvhtv6b")

  // remove
  collection.schema.removeField("thj6yqka")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ad0giw4b",
    "name": "userId",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 50,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5uy48evuvhtv6b")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "thj6yqka",
    "name": "userId",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("ad0giw4b")

  return dao.saveCollection(collection)
})

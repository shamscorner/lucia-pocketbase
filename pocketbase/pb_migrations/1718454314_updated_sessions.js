/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5uy48evuvhtv6b")

  // remove
  collection.schema.removeField("enclftrf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jlivjmnh",
    "name": "attributes",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5uy48evuvhtv6b")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "enclftrf",
    "name": "username",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 50,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("jlivjmnh")

  return dao.saveCollection(collection)
})

import type { ICategory } from "../models";

export function getCategories(): ICategory[] {
  //TODO: GET from db
  return [
    {
      _id: "1",
      title: "ACC",
      color: "blue",
    },
    {
      _id: "2",
      title: "Private",
      color: "green",
    },
  ];
}

export function addCategory(category: ICategory) {
  // TODO: POST to db
  console.log(category); 
}

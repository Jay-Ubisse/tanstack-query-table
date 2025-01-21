import { UserProps } from "../types/users";

export async function getUsers(): Promise<UserProps[] | undefined> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

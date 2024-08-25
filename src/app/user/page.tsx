import React from "react";
import { sql } from "@vercel/postgres";
async function getData(params: { user: string }) {
  const { rows } = await sql`SELECT * from users where id=${params.user}`;
  console.log(rows);
  return rows;
}
type Props = {};

const UserPage = async (props: Props) => {
  const data = await getData({ user: "410544b2-4001-4271-9855-fec4b6a6442a" });
  return (
    <div>
      UserPage,
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default UserPage;

import { Hairdressers } from "../class/HairdressersClass.js";

export async function getData() {
  const url = "https://salonsapi.prooktatas.hu/api/hairdressers";
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      /*console.log(json)*/

      return json.map(hd => new Hairdressers(
          hd.id,
          hd.name,
          hd.phone_number,
          hd.email,
          hd.work_start_time,
          hd.work_end_time,
          hd.services
      ));

  } catch (error) {
      console.error(error.message);
      return [];
  }
}

import { Confirm, Password, Select, SelectOption } from "~/lib/prompts/"

// const p = await <Text message="Test" />
// const p2 = await <Password message="Password" />
// const p3 = await <Confirm message="R u sure?" />
const p4 = await (
  <Select message="Choose">
    <SelectOption value="1" hint="One" />
    <SelectOption value={{ key: "val" }} label="Empty" />
    <SelectOption value="3" label="Three" hint="Woops" />
  </Select>
)

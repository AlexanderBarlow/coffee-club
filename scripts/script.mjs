import { main as seedDrinks } from "./seed-drinks.mjs";
import { main as seedAdmin } from "./seed-user.mjs"

await seedDrinks();
await seedAdmin();


import { execSync } from "child_process";

const scripts = ["etl-crime", "etl-cfs", "etl-traffic", "etl-map"];

for (const script of scripts) {
  console.log(`\n=== Running ${script} ===`);
  execSync(`npx tsx scripts/${script}.ts`, { stdio: "inherit" });
}

console.log("\n✓ All ETL scripts complete.");

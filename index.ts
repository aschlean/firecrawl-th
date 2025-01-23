import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import * as dotenv from "dotenv";
import * as readline from "readline";
import ora from 'ora';

dotenv.config();

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || ""
});

const zodSchema = z.array(z.object({
  position: z.string(),
  location: z.string(),
  link: z.string().url(),
  remote: z.union([z.boolean(), z.literal("not disclosed")]),
  postedDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  compensation: z.string().optional()
}));

type JobListing = z.infer<typeof zodSchema>;

async function extractJobListings(url: string) {
  // Ensure URL has https:// prefix and add a wildcard at the end
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  if (!url.endsWith('/*')) {
    url += '/*';
  }

  const spinner = ora({
    text: 'Searching for job listings...',
    color: 'blue'
  }).start();

  try {
    const scrapeResult = await app.extract([url], {
      prompt: "Extract all job listings from this page and return them as an array with key 'jobListings'. For each job listing, include: position (job title), location (work location), link (URL to apply), remote (true/false/'not disclosed'), postedDate (when posted), applicationDeadline (if available), and compensation (salary/compensation if available). If remote status or other optional fields are not explicitly stated, mark them as 'not disclosed'.",
    });

    if (!scrapeResult.success) {
      spinner.fail('Failed to fetch job listings');
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }

    const response = scrapeResult.data as { jobListings: JobListing };
    const jobs = response.jobListings;
    
    if (!Array.isArray(jobs)) {
      spinner.fail('Invalid response format');
      throw new Error('Expected an array of job listings');
    }

    spinner.succeed(`Found ${jobs.length} job listings`);
    return jobs;
  } catch (error) {
    spinner.fail('Failed to fetch job listings');
    throw error;
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for URL
rl.question('Enter the company URL (e.g., openai.com): ', (url) => {
  console.log(`Scraping jobs from: ${url}`);
  
  extractJobListings(url)
    .then(jobs => {
      if (jobs.length === 0) {
        console.log('No job listings found.');
      } else {
        console.log('\nFound job listings:');
        console.log(JSON.stringify(jobs, null, 2));
      }
      rl.close();
    })
    .catch(error => {
      console.error("Error:", error);
      rl.close();
    });
});

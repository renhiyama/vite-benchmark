//This file will be moved into any vite project, and will be used to benchmark the build time of the project - dev mode specifically.
//Since Vite doesn't build the project unless you make a request, we need to make a request to the server to trigger the build.
//This file will be used to make that request, and then measure the time it takes to build the project.
//run vite under spawned process

import {spawn} from 'node:child_process';
import {join} from 'node:path';

const projectDir = process.cwd();

const benchmarker = async () => {
  const startTime = Date.now();
  const viteProcess = spawn('node', [join(projectDir, 'node_modules/vite/bin/vite.js'), "--port", "3000", "--force"], {
    cwd: projectDir,
  });
  //wait for the server to start
  await new Promise((resolve) => {
    viteProcess.stdout.on('data', (data) => {
      if (data.toString().includes('ready in')) {
        console.log(data.toString())
        resolve();
      }
    });
  });
  //make a request to the server
  await fetch('http://localhost:3000');
  //kill the vite process and return
  viteProcess.kill();
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  console.log(`Total time taken: ${totalTime}ms`);
}
await benchmarker();
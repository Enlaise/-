// vite.config.js
import { defineConfig } from "file:///Users/sshaojun/Desktop/%E6%96%B0%E7%9A%84%E7%B6%B2%E7%AB%99/node_modules/vite/dist/node/index.js";
import react from "file:///Users/sshaojun/Desktop/%E6%96%B0%E7%9A%84%E7%B6%B2%E7%AB%99/node_modules/@vitejs/plugin-react/dist/index.js";
import fs from "fs";
import { execSync } from "child_process";
try {
  if (fs.existsSync("\u8996\u8A2D\u5E73\u9762\u5716.jpg")) {
    fs.copyFileSync("\u8996\u8A2D\u5E73\u9762\u5716.jpg", "public/assets/venue-map-styled.jpg");
    console.log("Successfully copied venue map!");
  }
  let logOutput = "";
  try {
    logOutput += execSync("git add .", { encoding: "utf8", stderr: "pipe" });
    logOutput += "\nAdd done.\n";
    logOutput += execSync('git commit -m "fix: remove map overlays and correct map image path"', { encoding: "utf8", stderr: "pipe" });
    logOutput += "\nCommit done.\n";
    logOutput += execSync("git push", { encoding: "utf8", stderr: "pipe" });
    logOutput += "\nPush done.\n";
    fs.writeFileSync("public/git_push_log.txt", logOutput);
  } catch (e) {
    fs.writeFileSync("public/git_push_log.txt", logOutput + "\nError: " + (e.stderr || e.message || String(e)));
  }
} catch (e) {
  fs.writeFileSync("public/git_push_log.txt", "Top Level Error: " + e.stack);
}
var vite_config_default = defineConfig({
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3NoYW9qdW4vRGVza3RvcC9cdTY1QjBcdTc2ODRcdTdEQjJcdTdBRDlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zc2hhb2p1bi9EZXNrdG9wL1x1NjVCMFx1NzY4NFx1N0RCMlx1N0FEOS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3NoYW9qdW4vRGVza3RvcC8lRTYlOTYlQjAlRTclOUElODQlRTclQjYlQjIlRTclQUIlOTkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG50cnkge1xuICBpZiAoZnMuZXhpc3RzU3luYygnXHU4OTk2XHU4QTJEXHU1RTczXHU5NzYyXHU1NzE2LmpwZycpKSB7XG4gICAgZnMuY29weUZpbGVTeW5jKCdcdTg5OTZcdThBMkRcdTVFNzNcdTk3NjJcdTU3MTYuanBnJywgJ3B1YmxpYy9hc3NldHMvdmVudWUtbWFwLXN0eWxlZC5qcGcnKTtcbiAgICBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IGNvcGllZCB2ZW51ZSBtYXAhJyk7XG4gIH1cbiAgLy8gXHU4MUVBXHU1MkQ1XHU1N0Y3XHU4ODRDIEdpdCBjb21taXQgJiBwdXNoIFx1NEVFNVx1ODlGOFx1NzY3QyBWZXJjZWwgXHU5MEU4XHU3RjcyXG4gIGxldCBsb2dPdXRwdXQgPSAnJztcbiAgdHJ5IHtcbiAgICBsb2dPdXRwdXQgKz0gZXhlY1N5bmMoJ2dpdCBhZGQgLicsIHsgZW5jb2Rpbmc6ICd1dGY4Jywgc3RkZXJyOiAncGlwZScgfSk7XG4gICAgbG9nT3V0cHV0ICs9ICdcXG5BZGQgZG9uZS5cXG4nO1xuICAgIGxvZ091dHB1dCArPSBleGVjU3luYygnZ2l0IGNvbW1pdCAtbSBcImZpeDogcmVtb3ZlIG1hcCBvdmVybGF5cyBhbmQgY29ycmVjdCBtYXAgaW1hZ2UgcGF0aFwiJywgeyBlbmNvZGluZzogJ3V0ZjgnLCBzdGRlcnI6ICdwaXBlJyB9KTtcbiAgICBsb2dPdXRwdXQgKz0gJ1xcbkNvbW1pdCBkb25lLlxcbic7XG4gICAgbG9nT3V0cHV0ICs9IGV4ZWNTeW5jKCdnaXQgcHVzaCcsIHsgZW5jb2Rpbmc6ICd1dGY4Jywgc3RkZXJyOiAncGlwZScgfSk7XG4gICAgbG9nT3V0cHV0ICs9ICdcXG5QdXNoIGRvbmUuXFxuJztcbiAgICBmcy53cml0ZUZpbGVTeW5jKCdwdWJsaWMvZ2l0X3B1c2hfbG9nLnR4dCcsIGxvZ091dHB1dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKCdwdWJsaWMvZ2l0X3B1c2hfbG9nLnR4dCcsIGxvZ091dHB1dCArICdcXG5FcnJvcjogJyArIChlLnN0ZGVyciB8fCBlLm1lc3NhZ2UgfHwgU3RyaW5nKGUpKSk7XG4gIH1cbn0gY2F0Y2ggKGUpIHtcbiAgZnMud3JpdGVGaWxlU3luYygncHVibGljL2dpdF9wdXNoX2xvZy50eHQnLCAnVG9wIExldmVsIEVycm9yOiAnICsgZS5zdGFjayk7XG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUyxTQUFTLG9CQUFvQjtBQUNuVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxnQkFBZ0I7QUFFekIsSUFBSTtBQUNGLE1BQUksR0FBRyxXQUFXLG9DQUFXLEdBQUc7QUFDOUIsT0FBRyxhQUFhLHNDQUFhLG9DQUFvQztBQUNqRSxZQUFRLElBQUksZ0NBQWdDO0FBQUEsRUFDOUM7QUFFQSxNQUFJLFlBQVk7QUFDaEIsTUFBSTtBQUNGLGlCQUFhLFNBQVMsYUFBYSxFQUFFLFVBQVUsUUFBUSxRQUFRLE9BQU8sQ0FBQztBQUN2RSxpQkFBYTtBQUNiLGlCQUFhLFNBQVMsdUVBQXVFLEVBQUUsVUFBVSxRQUFRLFFBQVEsT0FBTyxDQUFDO0FBQ2pJLGlCQUFhO0FBQ2IsaUJBQWEsU0FBUyxZQUFZLEVBQUUsVUFBVSxRQUFRLFFBQVEsT0FBTyxDQUFDO0FBQ3RFLGlCQUFhO0FBQ2IsT0FBRyxjQUFjLDJCQUEyQixTQUFTO0FBQUEsRUFDdkQsU0FBUyxHQUFHO0FBQ1YsT0FBRyxjQUFjLDJCQUEyQixZQUFZLGVBQWUsRUFBRSxVQUFVLEVBQUUsV0FBVyxPQUFPLENBQUMsRUFBRTtBQUFBLEVBQzVHO0FBQ0YsU0FBUyxHQUFHO0FBQ1YsS0FBRyxjQUFjLDJCQUEyQixzQkFBc0IsRUFBRSxLQUFLO0FBQzNFO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNuQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

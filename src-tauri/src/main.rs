#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::io::BufWriter;
use tauri::Manager;
use steamworks;
use image::{self, RgbaImage};
use base64;

#[derive(serde::Serialize, Clone)]
struct Payload {
  name: String,
  avatar: String
}


fn main() {
  let (client, _single) = steamworks::Client::init().unwrap();

  let myself = client.friends().get_friend(client.user().steam_id());



  tauri::Builder::default()
    .setup(|app| {
      let steamworks_name = app.listen_global("get_steam", |_event| {
        let base64_or_none_pic = match myself.small_avatar() {
          Some(buffer) => {
            let avatar_png: Vec<u8> = vec!();
            image::codecs::png::PngEncoder::new(avatar_png).encode(&buffer, 32, 32, image::ColorType::Rgba8);
            base64::encode(avatar_png)
          },
          None => {
            String::from("none")
          }
        };
        app.emit_all("steam_data", Payload {name: myself.name(), avatar: base64_or_none_pic});
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use base64;
use image::{self, RgbaImage};
use std::{io::BufWriter, sync::Arc};
use steamworks;
use tauri::{App, AppHandle, Manager};

#[derive(serde::Serialize, Clone)]
struct Payload {
  name: String,
  avatar: String,
}

fn main() {
  let (client, _single) = steamworks::Client::init().unwrap();
  let myself = client.friends().get_friend(client.user().steam_id());
  let name = myself.name();
  let base64_or_none_pic = match myself.small_avatar() {
    Some(buffer) => {
      let mut avatar_png: Vec<u8> = vec![];
      image::codecs::png::PngEncoder::new(&mut avatar_png).encode(
        &buffer,
        32,
        32,
        image::ColorType::Rgba8,
      );
      base64::encode(avatar_png)
    }
    None => String::from("none"),
  };
  
  tauri::Builder::default()
    .setup(move |app| {
      let apphandle = app.handle();
      let steam_name = name.clone();
      let steam_avatar = base64_or_none_pic.clone();
      let steamworks_name = app.listen_global("get_steam", move |_event| {
        emit_steam_data(&apphandle, &steam_name, &steam_avatar);
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn emit_steam_data(app: &AppHandle, name: &str, avatar: &str) {
  app.emit_all(
    "steam_data",
    Payload {
      name: String::from(name),
      avatar: String::from(avatar),
    },
  );
}
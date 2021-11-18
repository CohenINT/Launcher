export class Progress extends Element 
{
    current_action = "Baking beans";
    current_state = "My fucking beans are fried";

    hash_progress = "100";
    hash_progress_done = "0";
    hash_progress_total = "0";
    download_progress = "34";
    download_speed = "0";
    patch_progress = "98";
    patch_progress_done = "0";
    patch_progress_total = "0";

    paused = false;
    in_progress = false;

    get_progressbar_style(width) {
      return printf("width:%s%%", width);
    }
    actionOrProgressbars() {
      if (this.hash_progress_total != "0") { 
        return <div>
          <p>Validating files: <span class="green hexpand">{this.hash_progress}%</span>{this.hash_progress_done}/{this.hash_progress_total} files</p>
          <div class="downloadBar"><progressbar class="indicator" style={this.get_progressbar_style(this.hash_progress)}></progressbar></div>
          <p>Dowloading: <span class="green hexpand">{this.download_progress}%</span>{this.download_speed}</p>
          <div class="downloadBar"><progressbar class="indicator" style={this.get_progressbar_style(this.download_progress)}></progressbar></div>
          <p>Applying: <span class="green hexpand">{this.patch_progress}%</span>{this.patch_progress_done}/{this.patch_progress_total} files</p>
          <div class="downloadBar"><progressbar class="indicator" style={this.get_progressbar_style(this.patch_progress)}></progressbar></div>
        </div>;
      } else {
        return <p>{this.current_state}</p>
      }
    }

    render(props) {
        return <div id="progress" class="settings-window">
        <div class="titlebar">
          <h3 class="title center uppercase" style="width: *;">{this.current_action}</h3>
          <div class="minimize" close></div>
        </div>
        <div class="padding">
          {this.actionOrProgressbars()}

          <div><button id="left" class="orange">Cancel</button><button id="right" class="green"><p>Start</p></button></div>
        </div>
      </div>
    }

    progress_callback(action) {
      document.$("div#progress").componentUpdate({current_state: action});
    }

    failure_callback(error) {
      document.$("div#progress").componentUpdate({current_state: error});
    }

    success_callback() {
      document.$("div#progress").componentUpdate({current_state: "Done"});
    }

    ["on click at button#left"](evt, input) {
      console.log("cancelling download");
      Window.this.xcall("cancel_patcher");
    }

    ["on click at button#right"](evt, input) {
      if (!this.in_progress) {
        console.log("starting download");
        Window.this.xcall("start_download", this.progress_callback, this.success_callback, this.failure_callback);
        this.in_progress = true;
        evt.target.content(<p>Pause</p>);
      } else if (this.paused) {
        console.log("resuming patcher");

        Window.this.xcall("resume_patcher");
        this.paused = false;
        evt.target.content(<p>Pause</p>);
      } else {
        console.log("pausing patcher");

        Window.this.xcall("pause_patcher");
        this.paused = true;
        evt.target.content(<p>Resume</p>);
      }
    }
}
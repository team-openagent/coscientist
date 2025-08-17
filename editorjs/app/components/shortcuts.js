// supported commands: [shift, cmd, command, ctrl, control, windwos, alt]
// special commands: [backspace, enter, right, left, up, down, escape, insert, delete]
// github.com/codex-team/codex.shortcuts
// npm install @codexteam/shortcuts --save 
let cmdA = new Shortcut({
    name: 'CMD+A',
    on: document.body,
    callback: function(event) {}
})

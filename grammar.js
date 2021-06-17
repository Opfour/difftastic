if_args = [
  "1",
  "ON",
  "YES",
  "TRUE",
  "Y",
  "0",
  "OFF",
  "NO",
  "FALSE",
  "N",
  "IGNORE",
  "NOTFOUND",
  "NOT",
  "AND",
  "OR",
  "COMMAND",
  "POLICY",
  "TARGET",
  "TEST",
  "DEFINED",
  "CACHE",
  "ENV",
  "IN_LIST",
  "EXISTS",
  "IS_NEWER_THAN",
  "IS_DIRECTORY",
  "IS_SYMLINK",
  "IS_ABSOLUTE",
  "MATCHES",
  "LESS",
  "GREATER",
  "EQUAL",
  "LESS_EQUAL",
  "GREATER_EQUAL",
  "STRLESS",
  "STRGREATER",
  "STREQUAL",
  "STRLESS_EQUAL",
  "STRGREATER_EQUAL",
  "VERSION_LESS",
  "VERSION_GREATER",
  "VERSION_EQUAL",
  "VERSION_LESS_EQUAL",
  "VERSION_GREATER_EQUAL",
];
foreach_args = ["IN", "RANGE", "ZIP_LISTS", "LISTS", "ITEMS"];
module.exports = grammar({
  name: "cmake",

  rules: {
    source_file: ($) => repeat($._command_invocation),

    escape_sequence: ($) => choice($._escape_identity, $._escape_encoded, $._escape_semicolon),
    _escape_identity: (_) => /\\[^A-Za-z0-9;]/,
    _escape_encoded: (_) => choice("\\t", "\\r", "\\n"),
    _escape_semicolon: (_) => ";",

    variable: ($) => prec.left(repeat1(choice(/[a-zA-Z0-9/_.+-]/, $.escape_sequence))),
    variable_ref: ($) => choice($.normal_var, $.env_var, $.cache_var),
    normal_var: ($) => seq("${", $.variable, "}"),
    env_var: ($) => seq("$ENV", "{", $.variable, "}"),
    cache_var: ($) => seq("$CACHE", "{", $.variable, "}"),

    argument: ($) => choice($.bracket_argument, $.quoted_argument, $.unquoted_argument),

    bracket_argument: ($) => seq($._bracket_open, optional($.bracket_content), $._bracket_close),
    _bracket_open: (_) => seq("[", repeat("="), "["),
    bracket_content: (_) => repeat1(/[^\]]/),
    _bracket_close: (_) => seq("]", repeat("="), "]"),

    quoted_argument: ($) => seq('"', optional($.quoted_element), '"'),
    quoted_element: ($) => repeat1(choice($.variable_ref, /[^\\"]/, $.escape_sequence, seq("\\", newline()))),

    unquoted_argument: ($) => repeat1(choice($.variable_ref, /[^ ()#\"\\]/, $.escape_sequence)),

    if_command: ($) => command($.if, args(choice($.argument, ...if_args))),
    elseif_command: ($) => command($.elseif, args(choice($.argument, ...if_args))),
    else_command: ($) => command($.else, optional(args(choice($.argument, ...if_args)))),
    endif_command: ($) => command($.endif, optional(args(choice($.argument, ...if_args)))),
    if_condition: ($) =>
      seq($.if_command, repeat(choice($._command_invocation, $.elseif_command, $.else_command)), $.endif_command),

    foreach_command: ($) => command($.foreach, args(choice($.argument, ...foreach_args))),
    endforeach_command: ($) => command($.endforeach, optional($.argument)),
    foreach_loop: ($) => seq($.foreach_command, repeat($._command_invocation), $.endforeach_command),

    normal_command: ($) => command($.identifier, optional(args($.argument))),

    _command_invocation: ($) => choice($.normal_command, $.if_condition, $.foreach_loop),

    ...commandNames("if", "elseif", "else", "endif", "foreach", "endforeach"),
    identifier: (_) => /[A-Za-z_][A-Za-z0-9_]*/,
    integer: (_) => /[+-]*\d+/,
  },
});

function iregex(s) {
  return new RegExp(Array.from(s).reduce((acc, value) => acc + `[${value.toLowerCase()}${value.toUpperCase()}]`, ""));
}

function commandName(name) {
  return { [name]: (_) => iregex(name) };
}

function commandNames(...names) {
  return Object.assign({}, ...names.map(commandName));
}

function args(rule) {
  return seq(rule, repeat(prec.left(seq(repeat1(seperation()), optional(rule)))));
}
function command(name_rule, arg_rule) {
  return seq(name_rule, "(", repeat(seperation()), arg_rule, ")");
}
function seperation() {
  return choice(space(), newline());
}
function space() {
  return /[ \t]+/;
}
function newline() {
  return /\n+/;
}

/*
 * grammar.js
 * Copyright (C) 2021 Stephan Seitz <stephan.seitz@fau.de>
 * Adapted from tree-sitter-clojure
 *
 * Distributed under terms of the GPLv3 license.
 */

const clojure = require("tree-sitter-clojure/grammar");

const WHITESPACE_CHAR =
    /[\f\n\r\t \u000B\u001C\u001D\u001E\u001F\u2028\u2029\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2008\u2009\u200a\u205f\u3000]/;

const WHITESPACE =
    token(repeat1(WHITESPACE_CHAR));

const PREC = {
    NUM_LIT: 0,
    NORMAL: 1,
    PACKAGE_LIT: 2,
    DOTTET_LIT: 3,
    KWD_LIT: 4,
    SPECIAL: 5,
    META_LIT: 6,
}

const SYMBOL_HEAD =
    /[^:\f\n\r\t ()\[\]{}"@^;`\\,#'\u000B\u001C\u001D\u001E\u001F\u2028\u2029\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2008\u2009\u200a\u205f\u3000]/;

const SYMBOL_BODY =
    choice(SYMBOL_HEAD,
        /[#']/);

const SYMBOL =
    token(seq(SYMBOL_HEAD,
        repeat(SYMBOL_BODY)));


module.exports = grammar(clojure, {
    name: 'commonlisp',

    extras: ($, original) => [...original, $.block_comment],
    conflicts: ($, original) => [...original, [$.for_clause], [$.accumulation_clause],],

    rules: {
        block_comment: _ => token(seq('#|', repeat(choice(/[^|]/, /\|[^#]/)), '|#')),

        fancy_literal: _ => token(seq('|', repeat(/[^|]/), '|')),

        _ws: _ =>
            WHITESPACE,

        unquoting_lit: $ =>
            seq(field('marker', ","),
                repeat($._gap),
                field('value', $._form)),

        unquote_splicing_lit: $ =>
            seq(repeat($._metadata_lit),
                field('marker', ",@"),
                repeat($._gap),
                field('value', $._form)),

        syn_quoting_lit: $ =>
            seq(field('marker', "`"),
                repeat($._gap),
                field('value', ($._form))),

        defun: $ =>
            seq(field('open', "("),
                optional($._gap),
                $.defun_header,
                repeat(choice(field('value', $._form), $._gap)),
                field('close', ")")),

        for_clause_word: _ => choice('in',
            'across',
            'being',
            'using',
            /being (the|each) (hash-key[s]?|hash-value[s]?|present-symbol[s]?) (in|of)/,
            'below',
            'above',
            'from',
            'to',
            'upto',
            'downto',
            'downfrom',
            'on',
            'by',
            'then',
            '='),


        _for_part: $ => seq(repeat($._gap), $.for_clause_word, repeat($._gap), $._form),

        accumulation_verb: _ => /((collect|append|nconc|count|maximize|minimize)(ing)?|sum(ming)?)/,

        for_clause: $ => choice(seq(choice('for', 'and', 'as'), repeat($._gap), field('variable', $._form), optional(field('type', seq(repeat($._gap), $._form))),
            repeat1($._for_part)), 'and'),

        with_clause: $ => prec.left(seq('with', repeat($._gap), $._form, repeat($._gap), "=", repeat($._gap), $._form)),
        do_clause: $ => prec.left(seq('do', repeat1(prec.left(seq(repeat($._gap), $._form, repeat($._gap)))))),
        while_clause: $ => prec.left(seq(choice('while', 'until'), repeat($._gap), $._form)),
        repeat_clause: $ => prec.left(seq('repeat', repeat($._gap), $._form)),
        condition_clause: $ => prec.left(choice(seq(choice('when', 'if', 'unless', 'always', 'thereis', 'never'), repeat($._gap), $._form), "else")),
        accumulation_clause: $ => seq($.accumulation_verb, repeat($._gap), $._form, optional(seq(repeat($._gap), 'into', repeat($._gap), $._form))),
        termination_clause: $ => prec.left(seq(choice('finally', 'return', 'initially'), repeat($._gap), $._form)),


        loop_clause: $ =>
            seq(choice(
                $.for_clause,
                $.do_clause,
                $.list_lit,
                $.while_clause,
                $.repeat_clause,
                $.accumulation_clause,
                $.condition_clause,
                $.with_clause,
                $.termination_clause,
                $.while_clause,
            )),

        loop_macro: $ =>
            seq(field('open', "("),
                optional($._gap),
                choice(seq(optional(seq('cl', ':')), 'loop')),
                repeat(choice($.loop_clause, $._gap)),
                field('close', ")")),

        defun_keyword: _ => choice('defun', 'defmacro', 'defgeneric', 'defmethod'),

        defun_header: $ =>
            choice(
                seq(field('keyword', $.defun_keyword),
                    repeat($._gap),
                    field('function_name', $._form),
                    optional(field('specifier', seq(repeat($._gap), choice($.kwd_lit, $.sym_lit)))),
                    repeat($._gap),
                    field('lambda_list', choice($.list_lit, $.unquoting_lit))),
                seq(field('keyword', alias('lambda', $.defun_keyword)),
                    repeat($._gap),
                    field('lambda_list', choice($.list_lit, $.unquoting_lit)))
            ),

        array_dimension: $ => seq($.num_lit, choice('A', 'a')),

        char_lit: (_, original) =>
            seq(original),

        num_lit: (_, original) =>
            prec(PREC.NUM_LIT, original),


        _bare_vec_lit: $ =>
            prec(PREC.SPECIAL, choice(seq(field('open', choice('#0A', '#0a')), $.num_lit),
                seq(field('open', '#'), optional(field('dimension_indicator', $.array_dimension)), $.list_lit))),

        _bare_list_lit: $ =>
            choice(prec(PREC.SPECIAL, $.defun),
                prec(PREC.SPECIAL, $.loop_macro),
                seq(field('open', "("),
                    repeat(choice(field('value', $._form), $._gap)),
                    field('close', ")"))),

        //dotted_sym_lit: $ => prec.left(PREC.DOTTET_LIT, seq($.sym_lit, repeat1(seq(".", $.sym_lit)))),

        package_lit: $ => prec(PREC.PACKAGE_LIT, seq(
            field('package', $.sym_lit), // Make optional, instead of keywords?
            choice(':', '::'),
            field('symbol', $.sym_lit)
        )),

        kwd_lit: $ => prec(PREC.KWD_LIT, seq(
            choice(':', '::'),
            $.kwd_symbol,
        )),

        sym_lit: _ =>
            seq(SYMBOL),

        kwd_symbol: _ =>
            seq(SYMBOL),

        _form: $ =>
        seq(optional('#'),
            choice(// atom-ish
                $.num_lit,
                $.fancy_literal,
                $.kwd_lit,
                $.str_lit,
                $.char_lit,
                $.nil_lit,
                //$.bool_lit,
                $.package_lit,
                $.sym_lit,
                // basic collection-ish
                $.list_lit,
                //$.map_lit,
                $.vec_lit,
                // dispatch reader macros
                $.set_lit,
                //$.anon_fn_lit,
                //$.regex_lit,
                $.read_cond_lit,
                $.splicing_read_cond_lit,
                //$.ns_map_lit,
                $.var_quoting_lit,
                $.sym_val_lit,
                $.evaling_lit,
                //$.tagged_or_ctor_lit,
                // some other reader macros
                $.derefing_lit,
                $.quoting_lit,
                $.syn_quoting_lit,
                $.unquote_splicing_lit,
                $.unquoting_lit,
                $.include_reader_macro,
                $.complex_num_lit,
                ".",
                //seq($._gap, '.'),
            )),

        include_reader_macro: $ =>
            seq(repeat($._metadata_lit),
                field('marker', choice("#+", "#-")),
                repeat($._gap),
                field('condition', $._form),
                repeat($._gap),
                field('target', $._form)),

        complex_num_lit: $ =>
            seq(repeat($._metadata_lit),
                field('marker', choice("#C", "#c")),
                repeat($._gap),
                '(',
                repeat($._gap),
                field('real', $.num_lit), // only numbers allowed here
                repeat($._gap),
                field('imaginary', $.num_lit),
                repeat($._gap),
                ')'
            ),
    }
});

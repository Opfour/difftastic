================================================================================
enum_with_members
================================================================================

    const expect = @import("std").testing.expect;
const mem = @import("std").mem;
const fmt = @import("std").fmt;

const ET = union(enum) {
    SINT: i32,
    UINT: u32,

    pub fn print(a: *const ET, buf: []u8) anyerror!usize {
        return switch (a.*) {
            ET.SINT => |x| fmt.formatIntBuf(buf, x, 10, false, fmt.FormatOptions{}),
            ET.UINT => |x| fmt.formatIntBuf(buf, x, 10, false, fmt.FormatOptions{}),
        };
    }
};

test "enum with members" {
    const a = ET{ .SINT = -42 };
    const b = ET{ .UINT = 42 };
    var buf: [20]u8 = undefined;

    expect((a.print(buf[0..]) catch unreachable) == 3);
    expect(mem.eql(u8, buf[0..3], "-42"));

    expect((b.print(buf[0..]) catch unreachable) == 2);
    expect(mem.eql(u8, buf[0..2], "42"));
}

--------------------------------------------------------------------------------

(source_file
  (VarDecl
    (IDENTIFIER)
    (SuffixExpr
      (BUILTINIDENTIFIER)
      (FnCallArguments
        (SuffixExpr
          (STRINGLITERAL
            (STRINGLITERALSINGLE))))
      (SuffixOp
        (IDENTIFIER))
      (SuffixOp
        (IDENTIFIER))))
  (VarDecl
    (IDENTIFIER)
    (SuffixExpr
      (BUILTINIDENTIFIER)
      (FnCallArguments
        (SuffixExpr
          (STRINGLITERAL
            (STRINGLITERALSINGLE))))
      (SuffixOp
        (IDENTIFIER))))
  (VarDecl
    (IDENTIFIER)
    (SuffixExpr
      (BUILTINIDENTIFIER)
      (FnCallArguments
        (SuffixExpr
          (STRINGLITERAL
            (STRINGLITERALSINGLE))))
      (SuffixOp
        (IDENTIFIER))))
  (VarDecl
    (IDENTIFIER)
    (SuffixExpr
      (ContainerDecl
        (ContainerDeclType)
        (ContainerField
          (IDENTIFIER)
          (SuffixExpr
            (BuildinTypeExpr)))
        (ContainerField
          (IDENTIFIER)
          (SuffixExpr
            (BuildinTypeExpr)))
        (FnProto
          (IDENTIFIER)
          (ParamDeclList
            (ParamDecl
              (IDENTIFIER)
              (ParamType
                (PrefixTypeOp
                  (PtrTypeStart))
                (SuffixExpr
                  (IDENTIFIER))))
            (ParamDecl
              (IDENTIFIER)
              (ParamType
                (PrefixTypeOp
                  (SliceTypeStart))
                (SuffixExpr
                  (BuildinTypeExpr)))))
          (SuffixExpr
            (BuildinTypeExpr))
          (SuffixExpr
            (BuildinTypeExpr)))
        (Block
          (AssignExpr
            (SuffixExpr
              (SwitchExpr
                (SuffixExpr
                  (IDENTIFIER)
                  (SuffixOp))
                (SwitchProngList
                  (SwitchProng
                    (SwitchCase
                      (SwitchItem
                        (SuffixExpr
                          (IDENTIFIER)
                          (SuffixOp
                            (IDENTIFIER)))))
                    (PtrPayload
                      (IDENTIFIER))
                    (AssignExpr
                      (SuffixExpr
                        (IDENTIFIER)
                        (SuffixOp
                          (IDENTIFIER))
                        (FnCallArguments
                          (SuffixExpr
                            (IDENTIFIER))
                          (SuffixExpr
                            (IDENTIFIER))
                          (SuffixExpr
                            (INTEGER))
                          (SuffixExpr)
                          (SuffixExpr
                            (IDENTIFIER)
                            (SuffixOp
                              (IDENTIFIER)))
                          (InitList)))))
                  (SwitchProng
                    (SwitchCase
                      (SwitchItem
                        (SuffixExpr
                          (IDENTIFIER)
                          (SuffixOp
                            (IDENTIFIER)))))
                    (PtrPayload
                      (IDENTIFIER))
                    (AssignExpr
                      (SuffixExpr
                        (IDENTIFIER)
                        (SuffixOp
                          (IDENTIFIER))
                        (FnCallArguments
                          (SuffixExpr
                            (IDENTIFIER))
                          (SuffixExpr
                            (IDENTIFIER))
                          (SuffixExpr
                            (INTEGER))
                          (SuffixExpr)
                          (SuffixExpr
                            (IDENTIFIER)
                            (SuffixOp
                              (IDENTIFIER)))
                          (InitList)))))))))))))
  (TestDecl
    (STRINGLITERALSINGLE)
    (Block
      (VarDecl
        (IDENTIFIER)
        (SuffixExpr
          (IDENTIFIER))
        (InitList
          (FieldInit
            (IDENTIFIER)
            (UnaryExpr (PrefixOp)
            (SuffixExpr
              (INTEGER))))))
    (VarDecl
      (IDENTIFIER)
      (SuffixExpr
        (IDENTIFIER))
      (InitList
        (FieldInit
          (IDENTIFIER)
          (SuffixExpr
            (INTEGER)))))
    (VarDecl
      (IDENTIFIER)
      (PrefixTypeOp
        (ArrayTypeStart
          (SuffixExpr
            (INTEGER))))
      (SuffixExpr
        (BuildinTypeExpr))
      (SuffixExpr))
    (AssignExpr
      (SuffixExpr
        (IDENTIFIER)
        (FnCallArguments
          (BinaryExpr
            (SuffixExpr
              (GroupedExpr
                (BinaryExpr
                  (SuffixExpr
                    (IDENTIFIER)
                    (SuffixOp
                      (IDENTIFIER))
                    (FnCallArguments
                      (SuffixExpr
                        (IDENTIFIER)
                        (SuffixOp
                          (SuffixExpr
                            (INTEGER))))))
                  (BitwiseOp)
                  (SuffixExpr))))
            (CompareOp)
            (SuffixExpr
              (INTEGER))))))
    (AssignExpr
      (SuffixExpr
        (IDENTIFIER)
        (FnCallArguments
          (SuffixExpr
            (IDENTIFIER)
            (SuffixOp
              (IDENTIFIER))
            (FnCallArguments
              (SuffixExpr
                (BuildinTypeExpr))
              (SuffixExpr
                (IDENTIFIER)
                (SuffixOp
                  (SuffixExpr
                    (INTEGER))
                  (SuffixExpr
                    (INTEGER))))
              (SuffixExpr
                (STRINGLITERAL
                  (STRINGLITERALSINGLE))))))))
    (AssignExpr
      (SuffixExpr
        (IDENTIFIER)
        (FnCallArguments
          (BinaryExpr
            (SuffixExpr
              (GroupedExpr
                (BinaryExpr
                  (SuffixExpr
                    (IDENTIFIER)
                    (SuffixOp
                      (IDENTIFIER))
                    (FnCallArguments
                      (SuffixExpr
                        (IDENTIFIER)
                        (SuffixOp
                          (SuffixExpr
                            (INTEGER))))))
                  (BitwiseOp)
                  (SuffixExpr))))
            (CompareOp)
            (SuffixExpr
              (INTEGER))))))
    (AssignExpr
      (SuffixExpr
        (IDENTIFIER)
        (FnCallArguments
          (SuffixExpr
            (IDENTIFIER)
            (SuffixOp
              (IDENTIFIER))
            (FnCallArguments
              (SuffixExpr
                (BuildinTypeExpr))
              (SuffixExpr
                (IDENTIFIER)
                (SuffixOp
                  (SuffixExpr
                    (INTEGER))
                  (SuffixExpr
                    (INTEGER))))
              (SuffixExpr
                (STRINGLITERAL
                  (STRINGLITERALSINGLE)))))))))))

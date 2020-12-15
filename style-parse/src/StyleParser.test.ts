// const grammar = require("./Style.ne");
import * as nearley from "nearley";
import grammar from "./StyleParser";
import { find } from "lodash";

let parser;
const sameASTs = (results: any[]) => {
  for (const p of results) expect(results[0]).toEqual(p);
  expect(results.length).toEqual(1);
};

// USAGE:
// printAST(results[0])
const printAST = (ast: any) => {
  console.log(JSON.stringify(ast));
};

beforeEach(() => {
  // NOTE: Neither `feed` nor `finish` will reset the parser state. Therefore recompiling before each unit test
  parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
});

describe("Common", () => {
  test("empty program", () => {
    const { results } = parser.feed("");
    sameASTs(results);
  });
  test("type keyword check", () => {
    const prog = `
const { 
  A.shape = Circle {} 
  B.icon.x = 2.5
}
    `;
    const { results } = parser.feed(prog);
    sameASTs(results);
    const ast = results[0];
    const keyword = ast.blocks[0].block.statements[0].path.field;
    const id = ast.blocks[0].block.statements[1].path.field;

    expect(keyword.type).toEqual("type-keyword");
    expect(id.type).toEqual("identifier");
  });
});

describe("Selector Grammar", () => {
  test("empty namespace block", () => {
    const { results } = parser.feed("const { }");
    sameASTs(results);
  });

  test("empty selector block", () => {
    const { results } = parser.feed("forall Set A{}");
    sameASTs(results);
    const ast: StyProg = results[0] as StyProg;
  });

  test("comment and empty blocks", () => {
    const prog = `
  -- this is a comment

  Set A with Set B { 

  }
  
  forall Set A, \`B\`; Map f 
  { 
  }`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("forall keyword", () => {
    const prog = `
  Set B { }

  forall Set A, B { }

  Set \`C\` { }

  Set A, B { }

  Set A, \`B\`; Map f
  {

  }`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("nested preds", () => {
    const prog = `
forall Set A, B, C
where IsSubset(Union(A,B), C, Intersection(B, C));
{ }`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("empty pred", () => {
    const prog = `
forall Set A, B, C
where IsSubset(   );
{ }`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("with, where, and as", () => {
    const prog = `
forall Set A, B; Map f
with Set C, D; Map \`g\`
where C := intersect ( A, B, Not(f) ) ; IsSubset( A, B ); IsSubset( Union(A,B), C); Intersect (   )
as Const
{ }`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });
});

describe("Block Grammar", () => {
  test("empty block with comments and blank lines", () => {
    const prog = `
forall Set A, B; Map f as Const {
     
  -- comments




}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("single statement", () => {
    const prog = `
forall Set A, B; Map f as Const {
  delete A.arrow.center
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("delete statements with field, property paths", () => {
    const prog = `
forall Set A, B; Map f as Const {
  delete A.arrow.center
  delete B.arrow
  delete localx
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("line comments among statements", () => {
    const prog = `
forall Set A, B; Map f as Const {
  -- beginning comment
  delete A.arrow.center 
  -- between comment
  delete B.arrow
  delete localx
  -- end of block comment
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("line comments after statements", () => {
    const prog = `
forall Set A, B; Map f as Const {
  delete A.arrow.center -- end of statement comment
  -- between comment
  delete B.arrow
-- delete C.arrow 
  delete localx -- end of block comment
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("path assign with expressions", () => {
    const prog = `
Set B {
  -- property paths
  A.circle.boolProp = true
  A.circle.boolProp1 = false
  A.circle.strProp = "ABCdef1243_dfds&(*($#@"
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });
});

describe("Expr Grammar", () => {
  test("layering expr", () => {
    const prog = `
const {
  -- w/ optional keyword
  \`C\`.layering1 = layer A.circ above B.circ
  layering2 = layer B.circ below C.circ
  -- w/o optional keyword
  A.layering3 = A.circ above B.circ
  layering4 = B.circ below C.circ
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });
  test("string expr", () => {
    const prog = `
const {
  -- plain
  \`C\`.strin = "abs1232189y790yh97dasyhfda7fhnasopufn9"
  -- unicode
  chn = "penrose真好玩"
  -- escape char
  \`C\`.newline = "\\n"
  \`C\`.newline = "first line\\nnextline\\ttabbed"
  -- TODO: test slash
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("floating point expr", () => {
    const prog = `
const {
  -- varying
  v1 = ?
  v2 = ensure near(?, 4.2, .5)
  -- int
  f1 = 42
  f2 = 424242424242
  -- decimals
  -- d1 = .42
  d2 = 420.
  d3 = 04350. -- error?
  -- exp
  e1 = 0.0314E+2
  e2 = 314e-2 
  -- function
  A.func = comp("some string", 1.347e-2)
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("computation functions expr", () => {
    const prog = `
const {
  -- no arg
  B.fn = compute(    )
  -- literals
  A.fn = compute("string1", true, "string\\n", false)
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("objective and constraint expr", () => {
    const prog = `
const {
  -- encourage
  A.fn = encourage obj("string1", true, "string\\n", false)
  A.fn2 = encourage obj( a, b )
  -- ensure 
  A.fn = ensure obj("string1", true, "string\\n", false)
  -- shape should be processed as keyword
  B.fn = ensure same( A.shape.prop , B.shape  )
  localVar = ensure same( A.shp , B.shp  )
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("GPI constructor expr", () => {
    const prog = `
const {
  -- literals
  A.circle = Circle { -- comment begin
    strokeStyle: "dashed"
    -- comment between lines
    beautiful: true --comment inline
    center: B.circle.center
    -- comment end
  }
  -- empty
  \`A\`.circle = Circle {  }
  A.circle = Circle {
    --- comments 

  }
  -- venn
  p.icon = Circle {
    strokeWidth : 0.0
    color : rgba(0.0, 0.0, 0.0, 1.0)
    r : 3.0
  }
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
  });

  test("assigning arithmetic expr", () => {
    const prog = `
const {
  -- nesting and parens
  n1 = (1.0)
  n2 = (1.0 + .2) 
  n3 = 1.0 + 2.0 / .3
  -- plus/minus
  p1 = 1.0 - 2.0
  p2 = 1.0 + "string" -- should still parse 
  p3 = 1.0 + ? 
  p4 = 1.0 + 2.0 - 3.0 + 4.0 
  -- mul/div
  m1 = 1.0 / 2.0
  m2 = 1.0 * "string" -- should still parse 
  m3 = 1.0 / ? 
  m3 = 1.0 * ? 
  m4 = 1.0 * 2.0 / 3.0 / 4.0 
}`;
    const { results } = parser.feed(prog);
    sameASTs(results);
    printAST(results[0]);
  });
});

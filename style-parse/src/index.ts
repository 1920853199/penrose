import * as nearley from "nearley";
import styleGrammer from "./StyleParser";

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(styleGrammer));

const prog = `



-- this is a comment
forall Set A, B { }

forall Set A, \`B\`; Map f 



-- forall Set A, B; Map f
with Set C, D; Map \`g
-- where C := intersect (  )
-- where C := intersect ( A, B )
where C := intersect ( A, B, Not(f) ) ; IsSubset( A, B ); IsSubset( Union(A,B), C)
as Const
{ }

const { }`;

parser.feed(prog);
console.log(JSON.stringify(parser.results[0]));
console.log(JSON.stringify(parser.results[1]));
console.log("Possible parsings:", parser.results.length);
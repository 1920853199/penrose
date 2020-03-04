{-# LANGUAGE TemplateHaskell #-}
{-# OPTIONS_HADDOCK prune #-}

module Penrose.Serializer where

import           Penrose.Env
import           Penrose.GenOptProblem
import           Penrose.Optimizer
import           Penrose.Style
import           Penrose.SubstanceTokenizer
import           Penrose.Util

import           Data.Aeson
import           Data.Aeson.TH
import           Data.Char                  (toLower)
import           GHC.Generics
import qualified Numeric.LinearAlgebra      as L
import           System.Random              (StdGen)
import           Text.Megaparsec

--------------------------------------------------------------------------------
-- Packet serialization for server
data Packet a = Packet
  { packetType     :: String
  , packetSession  :: Maybe String
  , packetContents :: a
  }

$(deriveJSON
    defaultOptions
    {fieldLabelModifier = map toLower . drop 6, omitNothingFields = True}
    ''Packet)

data Request a = Request
  { requestSession :: Maybe String
  , requestCall    :: a
  }

$(deriveJSON
    defaultOptions
    {fieldLabelModifier = map toLower . drop 7, omitNothingFields = True}
    ''Request)

--------------------------------------------------------------------------------
instance ToJSONKey Name

instance FromJSONKey Name

instance ToJSONKey TypeVar

instance FromJSONKey TypeVar

instance ToJSONKey T

instance FromJSONKey T

instance ToJSONKey Var

instance FromJSONKey Var

--------------------------------------------------------------------------------
-- TODO: slowly move all the JSON decls other than the ones in Server to
--       this module
deriveJSON defaultOptions ''SourcePosition

deriveJSON defaultOptions ''Pos

deriveJSON defaultOptions ''SourcePos

deriveJSON defaultOptions ''Translation

deriveJSON defaultOptions ''Name

deriveJSON defaultOptions ''FieldExpr

deriveJSON defaultOptions ''TagExpr

deriveJSON defaultOptions ''Expr

deriveJSON defaultOptions ''AnnoFloat

deriveJSON defaultOptions ''BinaryOp

deriveJSON defaultOptions ''UnaryOp

deriveJSON defaultOptions ''PropertyDecl

deriveJSON defaultOptions ''Path

deriveJSON defaultOptions ''Var

deriveJSON defaultOptions ''BindingForm

deriveJSON defaultOptions ''StyVar

deriveJSON defaultOptions ''VarEnv

deriveJSON defaultOptions ''TypeVar

deriveJSON defaultOptions ''T

deriveJSON defaultOptions ''TypeCtorApp

deriveJSON defaultOptions ''TypeConstructor

deriveJSON defaultOptions ''Arg

deriveJSON defaultOptions ''K

deriveJSON defaultOptions ''ValConstructor

deriveJSON defaultOptions ''Y

deriveJSON defaultOptions ''Type

deriveJSON defaultOptions ''Operator

deriveJSON defaultOptions ''PredicateEnv

deriveJSON defaultOptions ''StmtNotationRule

deriveJSON defaultOptions ''Predicate1

deriveJSON defaultOptions ''Prop

deriveJSON defaultOptions ''Predicate2

deriveJSON defaultOptions ''Penrose.SubstanceTokenizer.Token

-- TODO: de-lambdaize this to make it serializable
-- deriveJSON defaultOptions ''Policy
deriveJSON defaultOptions ''Params

deriveJSON defaultOptions ''Fn

deriveJSON defaultOptions ''StdGen

deriveJSON defaultOptions ''PolicyParams

deriveJSON defaultOptions ''OptType

deriveJSON defaultOptions ''OptStatus

deriveJSON defaultOptions ''BfgsParams

deriveJSON defaultOptions ''Penrose.GenOptProblem.State

--------------------------------------------------------------------------------
-- Interface
deriveJSON defaultOptions ''CompilerError

deriveJSON defaultOptions ''RuntimeError
--------------------------------------------------------------------------------
-- Plugins
-- deriveJSON defaultOptions ''PluginInput

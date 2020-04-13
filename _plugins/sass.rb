# This file adds a function called url64() to SASS such that assets can be loaded as base64 data URIs.
# All paths become relative to the root of the project.

require "base64"
require "sass"
require 'mimemagic'

module Sass::Script::Functions
  def url64(image)
    assert_type image, :String

    base_path = "../.."
    root = File.expand_path(base_path, __FILE__)

    fullpath = File.expand_path(image.to_s.gsub('"', '').gsub(/^\//, ""), root)
    extension = fullpath.scan(/.*\.(.*)/).last.first

    mime = MimeMagic.by_magic(File.open(fullpath)).type
    file = File.open(fullpath, "rb")
    text = file.read
    file.close
    text_b64 = Base64.encode64(text).gsub(/\r/,"").gsub(/\n/,"")
    contents = "url(\"data:" + mime + ";base64," + text_b64 + "\")"

    Sass::Script::String.new(contents)

  end
  declare :url64, :args => [:string]
end

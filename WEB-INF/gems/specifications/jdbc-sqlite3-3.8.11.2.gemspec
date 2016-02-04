# -*- encoding: utf-8 -*-
# stub: jdbc-sqlite3 3.8.11.2 ruby lib

Gem::Specification.new do |s|
  s.name = "jdbc-sqlite3"
  s.version = "3.8.11.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Nick Sieger, Ola Bini, Karol Bucek and JRuby contributors"]
  s.date = "2015-10-29"
  s.description = "Install this gem `require 'jdbc/sqlite3'` and invoke `Jdbc::SQLite3.load_driver` within JRuby to load the driver."
  s.email = ["nick@nicksieger.com", "ola.bini@gmail.com", "self@kares.org"]
  s.homepage = "http://github.com/jruby/activerecord-jdbc-adapter/tree/master/jdbc-sqlite3"
  s.licenses = ["Apache-2"]
  s.rdoc_options = ["--main", "README.md"]
  s.require_paths = ["lib"]
  s.rubygems_version = "2.1.9"
  s.summary = "SQLite3 for JRuby, includes SQLite native libraries as well as the JDBC driver."
end

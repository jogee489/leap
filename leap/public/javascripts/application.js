// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/**
 * Check to see if a given string is blank.
 */
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}
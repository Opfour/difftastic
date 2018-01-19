==========
ZE2 Autoload and get_class_methods
==========

<?php

spl_autoload_register(function ($class_name) {
	require_once(dirname(__FILE__) . '/' . $class_name . '.p5c');
	echo 'autoload(' . $class_name . ")\n";
});

var_dump(get_class_methods('autoload_root'));

?>
===DONE===

---

(program  (expression_statement (function_call_expression (qualified_name (name)) (arguments (anonymous_function_creation_expression (simple_parameter (variable_name (name))) (compound_statement (expression_statement (require_once_expression (binary_expression (binary_expression (binary_expression (function_call_expression (qualified_name (name)) (arguments (qualified_name (name)))) (string)) (variable_name (name))) (string)))) (echo_statement (binary_expression (binary_expression (string) (variable_name (name))) (string)))))))) (expression_statement (function_call_expression (qualified_name (name)) (arguments (function_call_expression (qualified_name (name)) (arguments (string)))))) (text))

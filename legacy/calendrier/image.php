<?php header ("Content-type: image/png");
$ln = 10;
$image = imagecreate($ln, $ln);
$blanc = imagecolorallocate($image, 255, 255, 255);
if (isset($_GET['color']) && !empty($_GET['color'])) {
	$coloru = hex2rgb('#'.$_GET['color']);
	$color = imagecolorallocate($image, $coloru[0], $coloru[1], $coloru[2]);
} else {
	$color = imagecolorallocate($image, 0, 0, 0);
}
imagerectangle ($image, 0, 0, $ln-1, $ln-1, $color);
imagepng($image);

function hex2rgb($hex) {
   $hex = str_replace("#", "", $hex);

   if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
   } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
   }
   $rgb = array($r, $g, $b);
   //return implode(",", $rgb); // returns the rgb values separated by commas
   return $rgb; // returns an array with the rgb values
}
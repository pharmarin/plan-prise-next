<?php
 
/**
 * MySqlDump Exporter une base de donnee MySql avec Pdo
 *
 * @author Fobec 06/14
 * @see http://www.fobec.com/php5/1148/exporter-une-base-donnee-mysql-avec-pdo.html
 */
 
class MySqlDump {
 
    private $DB_CONF =
            array('host' => '', 'name' => '', 'user' => '',
        'password' => '', 'filter' => '*'
    );
    private $compressToZip = false;
    private $colInfo = array();
    private $MAX_SQLFILE_SIZE = 1000; //in Mo
 
    public function asZipArchive($host, $dbname, $user, $password, $filter = '*') {
        $this->DB_CONF = array('host' => $host,
        'name' => $dbname,
        'user' => $user,
        'password' => $password,
        'filter' => $filter);
 
        $this->compressToZip = true;
        $fziparchive = tempnam(sys_get_temp_dir(), $this->DB_CONF['name']);
 
        $files_dumpsql = $this->backupDB($this->DB_CONF, $fziparchive);
        date_default_timezone_set('Europe/Paris');
 
        if ($this->isZipValid($fziparchive, $files_dumpsql) == FALSE) {
            echo "ZipArchive seems to be corrupt";
        } else {
            header("Content-Type: application/zip");
            header("Content-Transfer-Encoding: Binary");
            header("Content-Length: " . filesize($fziparchive));
            header('Content-Disposition: attachment; filename="'. date("Y-m-d H-i-s") . ' sauvegarde' . '.zip' . '"'); //$this->DB_CONF['name']
            header("Content-Transfer-Encoding: binary");
            header('Expires: 0');
            header('Pragma: no-cache');
            /*  ob_clean();
              flush(); */
            readfile($fziparchive);
            exit(0);
        }
    }
 
    /**
     * Fixer la taille maximale du fichier d'export Sql
     * @param type $maxsize taille en Mo
     */
    public function setMaxFileSize($maxsize) {
        $this->MAX_SQLFILE_SIZE = $maxsize;
    }
 
    /**
     * Lancer l'export d'une base de donnée
     * @param type $db_conf
     * @param type $fziparchive
     * @return type
     */
    private function backupDB($db_conf, $fziparchive = '') {
        $file_dumptable = array();
 
        try {
            $pdo = new PDO('mysql:host=' . $db_conf['host'] . ';dbname=' . $db_conf['name'], $db_conf['user'], $db_conf['password']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 
            //List table from DBname
            $stmt = $pdo->prepare('SHOW TABLES');
            $stmt->execute();
 
            /** Table filter * */
            $filter_table = explode(';', $db_conf['filter']);
 
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                if (in_array($row[0], $filter_table) || $db_conf['filter'] == '*') {
                    $tables[] = $row[0];
                }
            }
            $stmt->closeCursor();
            $pdo = null;
 
            /* Dump each Table **/
            foreach ($tables as $tablename) {
                $ntemp = $this->backupTable($db_conf, $tablename, $fziparchive);
                foreach ($ntemp as $sqlfile) {
                    $file_dumptable[] = $sqlfile;
                }
            }//end loop table
 
            return $file_dumptable;
        } catch (PDOException $err) {
            $msg = __METHOD__ . ' - ' . $err->getMessage();
            echo $msg;
            $this->pdo = NULL;
        }
    }
 
    /**
     * Export Table to SQL File, files can be split
     * @param type $db_conf
     * @param type $tablename
     * @param type $fziparchive
     * @return string
     */
    private function backupTable($db_conf, $tablename, $fziparchive = '') {
        $pdo = new PDO('mysql:host=' . $db_conf['host'] . ';dbname=' . $db_conf['name'], $db_conf['user'], $db_conf['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//Avoid General error: 2008 MySQL client ran out of memory
        $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);
 
        $sql_files = array();
//Open new SQL File
        $tmpfile = tempnam(sys_get_temp_dir(), $tablename);
        $filelabel = $tablename . '.sql';
        $sql_files[] = array('file' => $tmpfile, 'name' => $filelabel);
        $fhandle = fopen($tmpfile, 'w');
 
//Create Table SQL
        $stmt = $pdo->prepare('SHOW CREATE TABLE ' . $tablename);
        $stmt->execute();
        $rs = $stmt->fetch(PDO::FETCH_NUM);
        $buf = '-- MySqlDump v.09 ' . "\n";
        $buf.='-- http://www.fobec.com/php5/1148/exporter-une-base-donnee-mysql-avec-pdo.html' . "\n\n";
        $buf.='-- server: ' . $db_conf['host'] . "\n";
        $buf.='-- date: ' . date('d/m/Y H:i:s') . "\n";
        $buf.='-- db: ' . $db_conf['name'] . "\n\n";
        $buf.='-- create table: ' . $tablename . "\n\n";
        $buf.= $rs[1] . ';' . "\n\n";
        fwrite($fhandle, $buf);
        $stmt->closeCursor();
 
        //colmuns type
        $stmt = $pdo->prepare('SHOW COLUMNS FROM ' . $tablename);
        $stmt->execute();
        $this->colInfo = $stmt->fetchAll(PDO::FETCH_NUM);
        $col_mapping = $this->parseColInfo($this->colInfo);
        $stmt->closeCursor();
 
        //Select All
        $stmt = $pdo->prepare('SELECT * FROM ' . $tablename);
        $stmt->execute();
 
        $line = '';
        $buf = '';
        $filecount = 2;
 
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $buf = "INSERT INTO " . $tablename . " VALUES (";
 
            $len = count($row);
            //Buffer value add slash if dif. than int
            for ($i = 0; $i < $len; $i++) {
                if ($i != ($len - 1)) {
                    $buf.=$this->setValue($row[$i], $col_mapping[$i]) . ',';
                } else {
                    $buf.=$this->setValue($row[$i], $col_mapping[$i]);
                }
            }
 
            $buf = $this->removeLineBreak($buf);
            $line.=$buf . ");\n";
            $buf = '';
 
            //Write SQL commands to file
            fwrite($fhandle, $line);
 
            //Start new file if max size reach
            if (ftell($fhandle) > (1024 * 1024 * $this->MAX_SQLFILE_SIZE)) {
                fclose($fhandle);
 
                $this->addTozipFile($fziparchive, $tmpfile, $filelabel);
                $sql_files[] = array('file' => $tmpfile, 'name' => $filelabel);
 
                $tmpfile = tempnam(sys_get_temp_dir(), $tablename . '_' . $filecount);
                $filelabel = $tablename . '_' . $filecount . '.sql';
                $filecount++;
                $fhandle = fopen($tmpfile, 'w');
            }
            $line = '';
        }
 
        fclose($fhandle);
        $this->addTozipFile($fziparchive, $tmpfile, $filelabel);
 
        $stmt->closeCursor();
        $pdo = null;
 
        return $sql_files;
    }
 
    /**
     * Compress Sql File in ZipArchive
     * @param type $fzip
     * @param type $file_path
     * @param type $file_name
     */
    private function addTozipFile($fzip, $file_path, $file_name) {
        if ($this->compressToZip == true) {
            $zip = new ZipArchive();
            $zip->open($fzip, ZIPARCHIVE::CREATE);
            $zip->addFile($file_path, $file_name);
 
            $zip->close();
        }
    }
 
    /**
     * Check if all sql files have been added
     * @param type $zipfile
     * @param type $files_sql
     * @return boolean
     */
    private function isZipValid($zipfile, $files_sql) {
        $zip = new ZipArchive;
        $res = $zip->open($zipfile);
        if ($res === TRUE) {
            foreach ($files_sql as $zfile) {
                $n = $zip->statName($zfile['name']);
                if ($n == FALSE || $n['size'] < 10) {
                    $zip->close();
                    return FALSE;
                }
            }
            $zip->close();
        } else {
            return FALSE;
        }
        return TRUE;
    }
 
    /**
     * Add Slashes if Value is String
     * @param type $val
     * @param type $isInt
     * @return string
     */
    private function setValue($val, $isInt) {
        if ($isInt) {
            return $val;
        } else {
            if (!empty($val)) {
                $sval = addslashes($val);
                return "'" . $sval . "'";
            } else {
                return "''";
            }
        }
    }
 
    /**
     * Remove Line break
     * @param type $line
     * @return type
     */
    private function removeLineBreak($line) {
        $nsearch = array("rn", "n", "r");
        $nreplace = array('rn', 'n', 'r');
 
 
        $sline = str_replace($nsearch, $nreplace, $line);
 
        return $sline;
    }
 
    /**
     * Build Field array with field type
     * @param type $rs
     * @return boolean
     */
    private function parseColInfo($rs) {
        $len = count($rs);
        $map = array();
        for ($i = 0; $i < $len; $i++) {
            if (substr($rs[$i][1], 0, 3) == 'int' || $rs[$i][1] == 'float') { //'Type'
                $map[] = true;
            } else {
                $map[] = false;
            }
        }
        return $map;
    }
 
}
?>
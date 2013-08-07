package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

var (
	cyclusSrc   = flag.String("cyclus-src", "./cyclus", "path to cyclus source (repository root)")
	cycamoreSrc = flag.String("cycamore-src", "./cycamore", "path to cycamore source (repository root)")
	installDir  = flag.String("install-dir", "./install", "path to install binaries and resource files")
	onlyCyclus  = flag.Bool("core", false, "true to only build cyclus (without cycamore)")
	ncpu        = flag.Int("j", 1, "number of processes to use")
)

var home string

func init() {
	log.SetPrefix("cycbuild: ")
	log.SetFlags(0)
	home, _ = filepath.Abs("./")
}

func main() {
	flag.Parse()
	var err error

	buildType := flag.Arg(0)
	if buildType == "" {
		buildType = "debug"
	}

	// make paths absolute
	*installDir, err = filepath.Abs(*installDir)
	if err != nil {
		log.Fatal(err)
	}

	*cyclusSrc, err = filepath.Abs(*cyclusSrc)
	if err != nil {
		log.Fatal(err)
	}

	*cycamoreSrc, err = filepath.Abs(*cycamoreSrc)
	if err != nil {
		log.Fatal(err)
	}

	if buildType == "clean" {
		rmbuild := exec.Command("rm", "-Rf",
			*installDir,
			filepath.Join(*cyclusSrc, "build"),
			filepath.Join(*cyclusSrc, "debug"),
			filepath.Join(*cyclusSrc, "release"),
			filepath.Join(*cycamoreSrc, "build"),
			filepath.Join(*cycamoreSrc, "debug"),
			filepath.Join(*cycamoreSrc, "release"),
		)
		must(run(rmbuild))
		return
	}

	must(os.MkdirAll(*installDir, 0777))
	must(buildRepo(*cyclusSrc, *installDir, buildType))

	if !*onlyCyclus {
		must(buildRepo(*cycamoreSrc, *installDir, buildType))
	}

	os.Chdir(home)
	rmlink := exec.Command("rm", "-Rf", "input", "bin")
	link := exec.Command("ln", "-s", filepath.Join(*installDir, "bin"), "./")
	linkinput := exec.Command("ln", "-s", filepath.Join(*cycamoreSrc, "input"))
	must(run(rmlink, link, linkinput))
}

func buildRepo(path, installDir, kind string) error {
	buildDir, err := filepath.Abs(filepath.Join(path, kind))
	if err != nil {
		return err
	}

	if err := os.MkdirAll(buildDir, 0777); err != nil {
		return err
	}

	os.Chdir(buildDir)

	cmakeArgs := []string{
		"-DCMAKE_BUILD_TYPE:STRING=" + kind,
		"-DCMAKE_INSTALL_PREFIX=" + installDir,
		"../src",
	}
	cmake := exec.Command("cmake", cmakeArgs...)
	mk := exec.Command("make", "-j"+fmt.Sprint(*ncpu))
	install := exec.Command("make", "install")

	return run(cmake, mk, install)
}

func run(cmds ...*exec.Cmd) error {
	for _, c := range cmds {
		c.Stdout = os.Stdout
		c.Stderr = os.Stderr
		c.Stdin = os.Stdin
		if err := c.Run(); err != nil {
			return err
		}
	}
	return nil
}

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

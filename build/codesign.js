/* https://github.com/electron-userland/electron-builder/issues/4785 */
/* eslint-disable @typescript-eslint/no-var-requires */

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const chalk = require("chalk");

const ownerName =
  process.env.CERT_OWNERNAME || `"Open Source Developer, Yuto Ashida"`;
const timestampServer =
  process.env.CERT_TIMESTAMPSERVER || "http://time.certum.pl/";
const verbose =
  (process.env.CERT_VERBOSE && process.env.CERT_VERBOSE === "true") || false;
const debug =
  (process.env.CERT_DEBUG && process.env.CERT_DEBUG === "true") || false;
const skip =
  (process.env.CERT_SKIP && process.env.CERT_SKIP === "true") || false;

async function doSign(file, hash, owner) {
  const sha256 = hash === "sha256";
  const appendCert = sha256 ? "/as" : null;
  const timestamp = sha256 ? "/tr" : "/t";
  const appendTd = sha256 ? "/td sha256" : null;
  const signDebug = debug ? "/debug" : null;

  let args = [
    "signtool",
    "sign",
    signDebug,
    "/n",
    owner,
    "/a",
    appendCert,
    "/fd",
    hash,
    timestamp,
    timestampServer,
    appendTd,
    "/v",
    `"${file}"`,
  ];

  const { stdout } = await exec(args.join(" "));
  if (verbose) {
    console.log(stdout);
  }
}

exports.default = async function (config) {
  if (!skip) {
    console.info(
      `Signing ${chalk.green.bold(config.path)} with ${chalk.magenta(
        config.hash
      )} to ${chalk.cyan.bold(ownerName)}`
    );
    await doSign(config.path, config.hash, ownerName);
  }
};

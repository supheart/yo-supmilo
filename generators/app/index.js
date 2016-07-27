'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the awesome ' + chalk.red('generator-supmilo') + ' generator!'
    ));

    var prompts = [{
      name: 'pname',
      message: 'What name is make your project：',
      default: 'milo-pro'
    }, {
      name: 'isapi',
      type: 'confirm',
      message: 'is a api project (default is not)',
      default: false
    }, {
      name: 'ismysql',
      type: 'confirm',
      message: 'is a mysql project (default is not)',
      default: false
    }, {
      name: 'isrsess',
      type: 'confirm',
      message: 'is set session to redis (default is not)',
      default: false
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    // 复制https证书文件
    this.fs.copy(
      this.templatePath('oauth'),
      this.destinationPath('oauth')
    );

    // 复制eslintrc
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    );
    // 复制gitignore
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
    // 复制launch.sh
    this.fs.copy(
      this.templatePath('launch.sh'),
      this.destinationPath('launch.sh')
    );

    var pkg = this.fs.readJSON(this.templatePath('package.json'));
    pkg.name = this.props.pname;
    // 判断是否是api项目
    if (this.props.isapi) {
      // 复制glupfile
      this.fs.copy(
        this.templatePath('apigulpfile.txt'),
        this.destinationPath('gulpfile.js')
      );

      // 复制api的内容文件
      this.fs.copyTpl(
        this.templatePath('apisrc'),
        this.destinationPath('src'),
        {
          pname: this.props.pname,
          isrsess: this.props.isrsess || false,
          ismysql: this.props.ismysql
        }
      );
    } else {
      var htmldepend = this.fs.readJSON(this.templatePath('htmldepend.json'));
      Object.assign(pkg.dependencies, htmldepend);
      var gulpdepend = this.fs.readJSON(this.templatePath('gulpdepend.json'));
      Object.assign(pkg.devDependencies, gulpdepend);
      // 复制glupfile
      this.fs.copy(
        this.templatePath('gulpfile.txt'),
        this.destinationPath('gulpfile.js')
      );

      // 复制html的内容文件
      this.fs.copyTpl(
        this.templatePath('src'),
        this.destinationPath('src'),
        {
          pname: this.props.pname,
          isrsess: this.props.isrsess || false,
          ismysql: this.props.ismysql,
          pagename: '<%= name %>'
        }
      );

      // 判断是否使用redis缓存
      if (this.props.isrsess) {
        var redisdepend = this.fs.readJSON(this.templatePath('redisdepend.json'));
        Object.assign(pkg.dependencies, redisdepend);
      }
    }

    // 判断是否需要mysql
    if (this.props.ismysql) {
      var mysqldepen = this.fs.readJSON(this.templatePath('sqldepend.json'));
      Object.assign(pkg.dependencies, mysqldepen);
    }

    // 创建package.json文件
    pkg.description = 'a project by ' + pkg.name;
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  },

  install: function () {
    // this.installDependencies();
    // this.npmInstall();
  }
});

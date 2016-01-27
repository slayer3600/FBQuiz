var quizApp = angular.module('quizApp', ['ngRoute', 'ui.bootstrap', 'naif.base64', 'angular-loading-bar']);

quizApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.        
        when("/", { templateUrl: "/partials/menu2.html", controller: "menuController" }).
        when("/:quizName", { templateUrl: "/partials/quiz.html", controller: "quizController" }).
        when("/quiz/:quizName", { templateUrl: "/partials/quiz.html", controller: "quizController" }).
        when("/privacypolicy", { templateUrl: "/partials/privacypolicy.html", controller: "menuController" }).
        when("/editquiz/:quizName", { templateUrl: "/partials/editquiz.html", controller: "editquizcontroller" }).
        otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode(true);

    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

}]);

quizApp.controller('editQuestionController', ['$scope', '$modalInstance', '$filter', 'nextQuestionID', 'rowToEdit', function ($scope, $modalInstance, $filter, nextQuestionID, rowToEdit) {

    $scope.nextQuestionID = nextQuestionID;
    $scope.rowToEdit = rowToEdit;

    $scope.mySelectedAnswer = (($scope.nextQuestionID == null) ? $filter('filter')($scope.rowToEdit.answerChoices, { isCorrect: true })[0].id : 1);

    $scope.question = {
        "answerChoices": []
    };

    $scope.imageToBase64 = function (url, callback, outputFormat) {

        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback(dataURL);
            canvas = null;
        };
        img.src = url;

    };

    if ($scope.nextQuestionID == null) {
        //edit existing question
        $scope.nextQuestionID = $scope.rowToEdit.id;
        $scope.myQuestion = $scope.rowToEdit.question;
        $scope.question.base64Image = $scope.rowToEdit.base64Image;
        $scope.isModalValid = true;
        //only used for binding existing image to view

        if (!$scope.rowToEdit.base64Image) {

            $scope.imageToBase64($scope.rowToEdit.imageURL, function (base64Img) {

                $scope.myBase64URL = base64Img;

            }, 'image/jpeg');

        } else {
            $scope.myBase64URL = "data:image/jpeg;charset=utf-8;base64," + $scope.rowToEdit.base64Image;
        };


        if ($scope.rowToEdit.answerChoices[0]) {
            $scope.myAnswerChoice1 = $scope.rowToEdit.answerChoices[0].choiceText;
        };

        if ($scope.rowToEdit.answerChoices[1]) {
            $scope.myAnswerChoice2 = $scope.rowToEdit.answerChoices[1].choiceText;
        };

        if ($scope.rowToEdit.answerChoices[2]) {
            $scope.myAnswerChoice3 = $scope.rowToEdit.answerChoices[2].choiceText;
        };

        if ($scope.rowToEdit.answerChoices[3]) {
            $scope.myAnswerChoice4 = $scope.rowToEdit.answerChoices[3].choiceText;
        };

        if ($scope.rowToEdit.answerChoices[4]) {
            $scope.myAnswerChoice5 = $scope.rowToEdit.answerChoices[4].choiceText;
        };

        if ($scope.rowToEdit.answerChoices[5]) {
            $scope.myAnswerChoice6 = $scope.rowToEdit.answerChoices[5].choiceText;
        };

    };

    

    $scope.ok = function (myForm) {

            $scope.question.question = $scope.myQuestion;
            $scope.question.id = $scope.nextQuestionID;

            if($scope.myFile != null){
                $scope.question.base64Image = $scope.myFile.base64;
            };
        

            if ($scope.myAnswerChoice1) {
                $scope.question.answerChoices.push({
                    id: "1",
                    choiceText: $scope.myAnswerChoice1,
                    isCorrect: $scope.mySelectedAnswer == 1,
                    choicePoints: 0
                });
            };

            if ($scope.myAnswerChoice2) {
                $scope.question.answerChoices.push({
                    id: "2",
                    choiceText: $scope.myAnswerChoice2,
                    isCorrect: $scope.mySelectedAnswer == 2,
                    choicePoints: 0
                });
            };

            if ($scope.myAnswerChoice3) {
                $scope.question.answerChoices.push({
                    id: "3",
                    choiceText: $scope.myAnswerChoice3,
                    isCorrect: $scope.mySelectedAnswer == 3,
                    choicePoints: 0
                });
            };

            if ($scope.myAnswerChoice4) {
                $scope.question.answerChoices.push({
                    id: "4",
                    choiceText: $scope.myAnswerChoice4,
                    isCorrect: $scope.mySelectedAnswer == 4,
                    choicePoints: 0
                });
            };

            if ($scope.myAnswerChoice5) {
                $scope.question.answerChoices.push({
                    id: "5",
                    choiceText: $scope.myAnswerChoice5,
                    isCorrect: $scope.mySelectedAnswer == 5,
                    choicePoints: 0
                });
            };

            if ($scope.myAnswerChoice6) {
                $scope.question.answerChoices.push({
                    id: "6",
                    choiceText: $scope.myAnswerChoice6,
                    isCorrect: $scope.mySelectedAnswer == 6,
                    choicePoints: 0
                });
            };

            $modalInstance.close($scope.question);

        };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    $scope.onImageLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

        $scope.myBase64URL = "data:image/jpeg;charset=utf-8;base64," + fileObj.base64;

    };

    $scope.isQuestionValid = true;
    $scope.isAnswerValid = true;

    $scope.checkModel = function () {
        $scope.isQuestionValid = !!$scope.myQuestion;
        $scope.isAnswerValid = !!$scope.myAnswerChoice1;
        $scope.isModalValid = (!!$scope.myQuestion && !!$scope.myAnswerChoice1);
    };

}]);

quizApp.controller('editquizcontroller', ['$scope', '$rootScope', '$modal', '$filter', '$routeParams', 'quizAPIService', function ($scope, $rootScope, $modal, $filter, $routeParams, quizAPIService) {

    $rootScope.quizTitle = "Create/Edit Quiz";
    $scope.quizFileName = $routeParams.quizName;

    $scope.quizTypes = [
        { 'name': 'Fact', 'value': 'F' },
        { 'name': 'Personality', 'value': 'P' },
    ];

    $scope.alerts = [];

    //set ddl to initial value
    $scope.myQuizType = $scope.quizTypes[0];

    $scope.quiz = {
        "Questions": []
    };

    $scope.imageToBase64 = function (url, callback, outputFormat) {

        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback(dataURL);
            canvas = null;
        };
        img.src = url;

    };

    //editing existing quiz
    if ($scope.quizFileName != "new") {

        quizAPIService.getQuestions($scope.quizFileName).then(function (d) {
            $scope.quiz = d;

            $scope.myQuizTitle = $scope.quiz.Title;
            $scope.myQuizDescription = $scope.quiz.Description;
            $scope.myQuizType.value = $scope.quiz.QuizType;
            $scope.myQuizURL = $scope.quizFileName;
            $scope.isValidURL = true;

            $scope.imageToBase64($scope.quiz.TitleScreenImageURL, function (base64Img) {

                $scope.myBase64URL = base64Img;
                $scope.quiz.TitleScreenBase64Image = base64Img.split(",")[1];
                $scope.$apply();

            }, 'image/jpeg');

        });

    };

    $scope.editQuestion = function (row) {

        $scope.modalInstance = $modal.open({
            animation: true,
            templateUrl: '/partials/questionModal.html',
            controller: 'editQuestionController',
            size: 'lg',
            resolve: {
                nextQuestionID: function () {
                    return null;
                },
                rowToEdit: function () {
                    return row;
                }
            }

        });

        $scope.modalInstance.result.then(function (modalQuestion) {
            $scope.quiz.Questions[modalQuestion.id - 1] = modalQuestion;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });

    };

    $scope.addNewQuestion = function () {

        $scope.modalInstance = $modal.open({
            animation: true,
            templateUrl: '/partials/questionModal.html',
            controller: 'editQuestionController',
            size: 'lg',
            resolve: {
                nextQuestionID: function () {
                    return $scope.quiz.Questions.length + 1;
                },
                rowToEdit: function () {
                    return null;
                }

            }

        });

        $scope.modalInstance.result.then(function (modalQuestion) {

            $scope.quiz.Questions.push(modalQuestion);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });

    };

    $scope.save = function (myForm) {

        if (myForm.$valid) {

            $scope.quiz.Title = $scope.myQuizTitle;
            $scope.quiz.Description = $scope.myQuizDescription;
            $scope.quiz.QuizType = $scope.myQuizType.value;
            $scope.quiz.DateAdded = $filter('date')(new Date(), 'MM/dd/yyyy');
            $scope.quiz.URL = $scope.myQuizURL;

            if ($scope.myFile) {
                $scope.quiz.TitleScreenBase64Image = $scope.myFile.base64;
            };
            
            quizAPIService.addQuiz($scope.quiz).then(function (d) {
                var currentDateTime = $filter('date')(new Date(), 'MM/dd/yyyy h:mma');
                $scope.alerts.push({ type: 'success', msg: '' + currentDateTime + ': Quiz successfully saved.' });
            });

        };

    };

    $scope.deleteAnswerChoice = function removeRow(row) {
        var index = $scope.quiz.Questions.indexOf(row);
        if (index !== -1) {
            $scope.quiz.Questions.splice(index, 1);
        }
    }

    $scope.onImageLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

        $scope.myBase64URL = "data:image/jpeg;charset=utf-8;base64," + fileObj.base64;

    };

    $scope.checkURL = function (url) {

        $scope.URLtoTest = angular.lowercase(url);

        quizAPIService.getWebAPIMenuItems().then(function (d) {

            if (!($filter('filter')(d, { URL: "/quiz/" + $scope.URLtoTest }, true).length == 0) || !($scope.URLtoTest !== 'new') || !($scope.URLtoTest !== '') || (typeof $scope.URLtoTest == 'undefined')) {
                $scope.isValidURL = false;
            } else {
                $scope.isValidURL = true;
            };
            
        });

    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

}]);

quizApp.controller('quizController', ['$scope', '$rootScope', '$routeParams', 'quizAPIService', '$filter', '$window', '$timeout', '$location', '$anchorScroll', function ($scope, $rootScope, $routeParams, quizAPIService, $filter, $window, $timeout, $location, $anchorScroll) {

    $scope.currentQuestionIdx = 0;
    $scope.selectedAnswer = 0;
    $scope.totalNumberofPoints = 0;
    $scope.currentQuestion = null;
    $scope.quizCompleted = false;
    $scope.quizTitleScreen = true;
    $scope.showResults = true;
    $scope.quizFileName = $routeParams.quizName;
    $scope.myURL = $window.location.href;

    $scope.showPopUp = function (url) {
        $window.open(url + $scope.myURL, "Share", "width=550, height=450");
    };

    $scope.facebookShare = function () {
        
        FB.ui({
            method: 'share',
            href: $scope.myURL,
        }, function (response) { });

    };

    $scope.checkMobileDevice = function(){

        var isMobile = false;

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

        $scope.isMobileDevice = isMobile;

    }   

    $scope.initSocialMedia = function () {

        twttr.widgets.createShareButton(
            $scope.myURL,
            document.getElementById("twitterPost"),
            {
                size: "medium",
                related: "quiz,quizzes",
                text: "Chick this out: ",
                hashtags: "quiz,quizzes"
            });

        FB.XFBML.parse();
        twttr.widgets.load();
        gapi.plus.go();

    };

    $scope.startQuiz = function () {

        $scope.quizTitleScreen = false;
        $scope.scrollTo('quizTop');
        ga('send', 'event', 'Quiz events', 'Quiz start', $scope.QuizData.Title);

    };

    $scope.indexToChoice = function (index) {

        var letterChoices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var letterChoicesArray = letterChoices.split("");
        var letterChoice = letterChoicesArray[index];

        return letterChoice;

    };

    $scope.getNextQuestion = function () {

        var numOfPoints = 0;

        numOfPoints = $filter('filter')($scope.questions[$scope.currentQuestionIdx].answerChoices, { choiceText: $scope.selectedAnswer }, true)[0].choicePoints;

        $scope.addResponse($scope.questions[$scope.currentQuestionIdx].id,
                            parseInt($scope.selectedAnswer),
                            $scope.questions[$scope.currentQuestionIdx].question,
                            $scope.selectedAnswer,
                            $filter('filter')($scope.questions[$scope.currentQuestionIdx].answerChoices, { isCorrect: true}, true)[0].choiceText);


        $scope.currentQuestionIdx++;
        $scope.currentQuestion = $scope.questions[$scope.currentQuestionIdx];
        $scope.selectedAnswer = "";
        $scope.totalNumberofPoints = ($scope.totalNumberofPoints + numOfPoints);

        if ($scope.currentQuestionIdx == $scope.questions.length) {
            //quiz completed
            $scope.quizCompleted = true;
            $scope.calculateResults();
            ga('send', 'event', 'Quiz events', 'Quiz finish', $scope.QuizData.Title, parseInt($scope.finalScore));
        };

        
            $scope.scrollTo('quizTop');
        
    };

    $scope.getPreviousQuestion = function () {
        $scope.currentQuestionIdx--;
        $scope.currentQuestion = $scope.questions[$scope.currentQuestionIdx];
        $scope.selectedAnswer = 0;
    };

    $scope.scrollTo = function (id) {

        //only if on a mobile device
        if ($scope.isMobileDevice) {
            $location.hash(id);
            $anchorScroll();
            $location.hash(null);
        }
        
    }

    $scope.loadData = function (url) {

        $window.scrollTo(0, 0);
        $scope.checkMobileDevice();
        quizAPIService.getQuestions(url).then(function (d) {

            $scope.QuizData = d;

            //preload images
            var images = [];
            var i = 0;
            
            angular.forEach(d.Questions, function (item) {

                //randomize answer order
                angular.forEach(item.answerChoices, function (item) {

                    item.rank = 0.5 - $window.Math.random();

                })

                //preload images
                images[i] = new Image();
                images[i].src = item.imageURL
                i++

            });

            $scope.questions = d.Questions;
            $scope.currentQuestion = $scope.questions[0];
            $rootScope.quizTitle = d.Title;


            ga('send', 'pageview', {
                'page': '' + $window.location.pathname + '',
                'title': '' + $rootScope.quizTitle + ''
            });
        });

    };

    $scope.addResponse = function (questionID, userChoice, question, selectedAnswer, correctAnswer) {
        $scope.responses.push({
            questionID: questionID,
            userChoice: userChoice,
            isCorrect: correctAnswer == selectedAnswer,
            question: question,
            selectedAnswer: selectedAnswer,
            correctAnswer: correctAnswer
        });

    };

    $scope.calculateResults = function () {

        if ($scope.QuizData.QuizType == "P") {

            //personality quiz
            angular.forEach($scope.QuizData.Results, function (result) {

                if ($scope.totalNumberofPoints >= result.minScore && $scope.totalNumberofPoints <= result.maxScore) {
                    $scope.personalityResult = result;
                }

            });

        } else {

            //fact quiz
            $scope.numberCorrect = $filter('filter')($scope.responses, { isCorrect: true }, true).length;
            $scope.finalScore = $filter('number')(100 * $scope.numberCorrect / $scope.questions.length, 0);

        }

    };

    $scope.responses = [];

    $scope.loadData($scope.quizFileName);

}]);

quizApp.controller('menuController', ['$scope', '$rootScope', 'quizAPIService', '$window', '$timeout', function ($scope, $rootScope, quizAPIService, $window, $timeout) {

    $scope.initSocialMedia = function () {

        twttr.widgets.createShareButton(
            $scope.myURL,
            document.getElementById("twitterPost"),
            {
                size: "medium",
                related: "quiz,quizzes",
                text: "Chick this out: ",
                hashtags: "quiz,quizzes"
            });

        FB.XFBML.parse();
        twttr.widgets.load();
        gapi.plus.go();

    };

    $scope.checkFacebookLogon = function () {

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
            } else {
                // the user isn't logged in to Facebook.
            }
        });

    };

    $scope.loadData = function () {
        $window.scrollTo(0, 0);
        
        quizAPIService.getWebAPIMenuItems().then(function (d) {
            $scope.menuItems = d;
            $rootScope.quizTitle = 'Pop Quizzes';
            ga('send', 'pageview', {
                'page': '' + $window.location.pathname +'',
                'title': '' + $rootScope.quizTitle + ''
            });
        });

        quizAPIService.getIsAuthorized().then(function (d) {
            $scope.isAuthorized = d;
        });
      
    };

    $scope.isNew = function (value) {

        var createDate = new Date(value);
        var currentDate = new Date();
        var daysOld = Math.floor((currentDate - createDate) / (1000 * 60 * 60 * 24));

        return (daysOld <= 14 ? true : false);

    };

    $scope.analytics = function (item) {

        ga('send', 'event', 'Quiz Events', 'Click from main menu', item.Title);

    };

    $scope.loadData();

    //fires after DOM is loaded
    $timeout(function(){

        $scope.initSocialMedia();

    },0,false);


}]);

quizApp.factory('quizAPIService', ['$http', function ($http) {

    return {

        getQuestions: function (url) {

            var url = '/data/' + url + '.json';
            var promise = $http.get(url).then(function (response) {

                return response.data;
            });
            // Return the promise to the controller
            return promise;

        },

        getMenuItems: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var url = '/data/quizMenu.json';
            var promise = $http.get(url).then(function (response) {
                // The then function here is an opportunity to modify the response

                //console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        getWebAPIMenuItems: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            // http://localhost:53985/api/Quiz
            var url = '/api/quiz/GetQuizMenuItems';
            var promise = $http.get(url).then(function (response) {
                // The then function here is an opportunity to modify the response

                console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        //delete dinner by ID
        getIsAuthorized: function (id) {
            // $http returns a promise, which has a then function, which also returns a promise
            var url = '/api/quiz/GetIsAuthorized';
            var promise = $http.get(url).then(function (response) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        //post new dinner
        addQuiz: function (quiz) {
            // $http returns a promise, which has a then function, which also returns a promise
            var url = '/api/quiz/AddNewQuiz';
            var promise = $http.post(url, quiz).then(function (response) {
                // The then function here is an opportunity to modify the response

                //console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        isMobileDevice: function(){

            var isMobile = false; //initiate as false
            // device detection
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

            return isMobile;

        }   

    };// factory return

}]);

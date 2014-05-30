//
//  RPSLSViewController.m
//  Rock, Paper, Scissors, Lizard, Spock Game for iPhone.
//
//  Created by Greg Hayes on 10/17/13.
//  Copyright (c) 2013 Greg Hayes. All rights reserved.
//

#import "RPSLSViewController.h"

@interface RPSLSViewController ()

@end

@implementation RPSLSViewController

@synthesize playerCounter, compCounter;

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    self.playerCounter = [[NSNumber alloc]  initWithInt:0];
    self.compCounter = [[NSNumber alloc]  initWithInt:0];

    _lblAlert.text = @"";
    _lblAlert.textColor = [UIColor redColor];
    _lblScorePlayer.text = [self.playerCounter stringValue];
    _lblScoreComputer.text = [self.compCounter stringValue];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(int)nameToNumber:(NSString *)name {
    if ([name isEqualToString:@"rock"]) {
        return 0;
    }
    else if ([name isEqualToString:@"Spock"]) {
        return 1;
    }
    else if ([name isEqualToString:@"paper"]) {
        return 2;
    }
    else if ([name isEqualToString:@"lizard"]) {
        return 3;
    }
    else if ([name isEqualToString:@"scissors"]) {
        return 4;
    }
    else {
        return 5;
    }
}

-(NSString*)numberToName:(int)number {
    if (number == 0){
        return @"rock";
    }
    else if (number == 1){
        return @"Spock";
    }
    else if (number == 2){
        return @"paper";
    }
    else if (number == 3){
        return @"lizard";
    }
    else if (number == 4){
        return @"scissors";
    }
    else {
        return @"";
    }
}

-(void)rpsls:(NSString*)name {
    NSLog(@"rpsls");
    int player_number = [self nameToNumber:name];
    int comp_number = arc4random() % 5;
    NSLog(@"Player chooses: %@", name);
    NSLog(@"Computer chooses %@", [self numberToName:comp_number]);

    int difference = (player_number - comp_number);
    int result = difference % 5;
    if( result < 0 ) result += 5;

    if (result == 0){
        NSLog(@"Player and computer tie!");
        _lblAlert.text = @"Player and computer tie!";
    }
    else if (result <= 2) {
        _lblAlert.text = @"Player wins!";
        self.playerCounter =  [NSNumber numberWithInt:[self.playerCounter intValue] + 1];
    }
    else if (result >=3) {
        _lblAlert.text = @"Computer wins!";
        self.compCounter =  [NSNumber numberWithInt:[self.compCounter intValue] + 1];
    }
    _lblScoreComputer.text = [self.compCounter stringValue];
    _lblScorePlayer.text = [self.playerCounter stringValue];
}

-(IBAction)clickedButton:(id)sender {
    [UIView animateWithDuration:0.5f animations:^{[_lblAlert setAlpha:0.0f];}];
    if (sender == _rockBtn){
        [self rpsls:@"rock"];
    }
    else if (sender == _paperBtn){
        [self rpsls:@"paper"];
    }
    else if (sender == _scissorsBtn){
        [self rpsls:@"scissors"];
    }
    else if (sender == _lizardBtn){
        [self rpsls:@"lizard"];
    }
    else if (sender == _spockBtn){
            [self rpsls:@"Spock"];
    }

    [self animateLblAlert];
}

-(void)animateLblAlert{
    // Fade In
    [UIView animateWithDuration:0.8
                          delay:0.6
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations:^{[_lblAlert setAlpha:1.0f];}
                     completion:^(BOOL finished){}];

    // Fade Out
    [UIView animateWithDuration:0.8
                          delay:0.3
                        options: UIViewAnimationOptionCurveEaseInOut
                     animations:^{[_lblAlert setAlpha:0.0f];}
                     completion:^(BOOL finished){}];
}

-(void)animateButton:(id)sender {
    //Animating of the selected Button
    if (sender == _rockBtn){
        _rockBtn.frame = CGRectMake(13,130,297,297);
    }
    else if (sender == _paperBtn){
        [self rpsls:@"paper"];
    }
    else if (sender == _scissorsBtn){
        [self rpsls:@"scissors"];
    }
    else if (sender == _lizardBtn){
        [self rpsls:@"lizard"];
    }
    else if (sender == _spockBtn){
        [self rpsls:@"Spock"];
    }
}

@end

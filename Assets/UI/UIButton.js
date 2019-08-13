#pragma strict

import System;

public class UIButton extends MonoBehaviour {
	public enum Type {Static, Tint, Horizontal, Vertical, Object, ReverseTint};
	public var type:UIButton.Type = UIButton.Type.Static;
	public var animateOnMouseUp:boolean = false;
	
	public var insideScrollPane:boolean = false;
	private var mouseEnterAnimationDelay:float = 0f;

	public var downTargetTag:String = "";
	public var downTarget:GameObject;
	public var downFunction:String = "";
	public var downArgument:String = "";

	public var outTargetTag:String = "";
	public var outTarget:GameObject;
	public var outFunction:String = "";
	public var outArgument:String = "";

	public var upTargetTag:String = "";
	public var upTarget:GameObject;
	public var upFunction:String = "";
	public var upArgument:String = "";

	private var over:boolean = false;
	private var pressing:boolean = false;
	public var selected:boolean = false;
	
	private var objectOff:GameObject;
	private var objectOn:GameObject;
	
	private var state:int = 0;
	
	private var currentTime:float = -1;
	private var deltaTime:float = 0;

	public function Awake():void {
		if (downTargetTag.Length > 0)
			SetDownTargetByTag(downTargetTag);
		if (outTargetTag.Length > 0)
			SetOutTargetByTag(outTargetTag);
		if (upTargetTag.Length > 0)
			SetUpTargetByTag(upTargetTag);
			
		if (type != UIButton.Type.Static)
			SetType(type);
	}
	
	public function OnMouseDown():void {
		// if (!SingleTouch.Instance().GetInputEnabled())
			// return;
	
		if (Input.touchCount > 1)
			return;
			
		if (!enabled)
			return;
		
		pressing = true;
		
		OnMouseEnter();
		
		if (downTarget) {
			if (downFunction.Length > 0) {
				if (downArgument.Length > 0)
					downTarget.SendMessage(downFunction, downArgument, SendMessageOptions.DontRequireReceiver);
				else
					downTarget.SendMessage(downFunction, SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	public function OnMouseEnter():void {
		if (!pressing)
			return;
			
		if (insideScrollPane) {
			
		}
		else {
			if (!selected)
				SetAnimationState(1);
		}
		
		over = true;
	}
	public function OnMouseExit():void {
		over = false;
	
		if (!pressing)
			return;
			
		if (!selected)
			SetAnimationState(0);
		
		if (outTarget) {
			if (outFunction.Length > 0) {
				if (outArgument.Length > 0)
					outTarget.SendMessage(outFunction, outArgument, SendMessageOptions.DontRequireReceiver);
				else
					outTarget.SendMessage(outFunction, SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	public function OnMouseUp():void {
		if (over)
			return;
		
		OnMouseCancel();
	}
	public function OnMouseUpAsButton():void {
		if (!pressing)
			return;
			
		pressing = false;
	
		if (!selected) {
			if (animateOnMouseUp)
				SetAnimationState(0);
			else
				SetAnimationState(1);
		}
			
		var buttons:UIButton[] = GameObject.FindObjectsOfType(typeof(UIButton));
		for (var i:int = 0; i < buttons.Length; i++) {
			var button:UIButton = buttons[i];
			if (button != this)
				button.OnMouseCancel();
		}
	
		if (upTarget) {
			if (upFunction.Length > 0) {
				if (upArgument.Length > 0)
					upTarget.SendMessage(upFunction, upArgument, SendMessageOptions.DontRequireReceiver);
				else
					upTarget.SendMessage(upFunction, SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	
	public function Update():void {
		//DeltaTime();
	
		if (!pressing) {
			if (insideScrollPane)
				mouseEnterAnimationDelay = .125f;
			return;
		}
		
		if (Input.touchCount > 1) {
			OnMouseCancel();
			return;
		}
		
		if (insideScrollPane) {
			mouseEnterAnimationDelay -= Time.deltaTime;
			if (mouseEnterAnimationDelay <= 0) {
				mouseEnterAnimationDelay = 0;
				if (state != 1 && over && !selected) {
					SetAnimationState(1);
				}
			}
		}
	}
	
	public function OnMouseCancel():void {
		if (!pressing)
			return;
		
		pressing = false;
		
		if (!selected)
			SetAnimationState(0);
	}
	
	public function GetOver():boolean {
		return over;
	}
	public function GetPressing():boolean {
		return pressing;
	}

	public function SetAnimationState(value:int):void {
		// must be 0 or 1
		if (value > 1)
			value = 1;
		else if (value < 0)
			value = 0;
	
		var state:int = value;
	
		if (selected)
			state = 1;
		
		if (type == UIButton.Type.Static) {
		
		}
		else if (type == UIButton.Type.Tint) {
			if (state == 1)
				//renderer.material.color = new Color(.5f, .5f, .5f, renderer.material.color.a);
				GetComponent.<Renderer>().material.color = new Color(.902f, .098f, .224f, GetComponent.<Renderer>().material.color.a);
			else
				GetComponent.<Renderer>().material.color = new Color(1f, 1f, 1f, GetComponent.<Renderer>().material.color.a);
		}
		else if (type == UIButton.Type.Horizontal || type == UIButton.Type.Vertical) {
			var columns:int = 1;
			var column:int = 0;
			var rows:int = 1;
			var row:int = 0;
			if (type == UIButton.Type.Horizontal) {
				columns = 2;
				column = state;
			}
			else {
				rows = 2;
				row = state;
			}
			var size:Vector2 = new Vector2(1f / parseFloat(columns), 1f / parseFloat(rows));
			var offset:Vector2 = new Vector2(parseFloat(column) * size.x, 1f - size.y - parseFloat(row) * size.y);
			GetComponent.<Renderer>().material.mainTextureOffset = offset;
			GetComponent.<Renderer>().material.mainTextureScale = size;
		}
		else if (type == UIButton.Type.Object) {
			objectOff.SetActive(state == 0);
			objectOn.SetActive(!objectOff.activeInHierarchy);
		}
		else if (type == UIButton.Type.ReverseTint) {
			if (state == 1)
				GetComponent.<Renderer>().material.color = new Color(1f, 1f, 1f, GetComponent.<Renderer>().material.color.a);
			else
				GetComponent.<Renderer>().material.color = new Color(.5f, .5f, .5f, GetComponent.<Renderer>().material.color.a);
		}
	}

	public function SetType(value:UIButton.Type):void {
		type = value;

		if (type == UIButton.Type.Object) {
			objectOff = transform.Find("Off").gameObject;
			objectOn = transform.Find("On").gameObject;
		}
		
		SetAnimationState(0);
	}
	
	public function SetAnimationStateByString(value:String):void {
		SetAnimationState(parseInt(value));
	}

	public function SetSelected(bool:boolean):void {
		selected = bool;
		SetAnimationState(Convert.ToInt32(selected));
	}
	
	public function SetSelectedByString(value:String):void {
		value = value.ToLower();
		if (value == "true" || value == "t" || value == "1")
			SetSelected(true);
		else
			SetSelected(false);
	}
	
	public function SetDownTargetByTag(tag:String):void {
		downTargetTag = tag;
		if (tag.Length > 0)
			downTarget = GameObject.FindWithTag(tag);
	}
	public function SetOutTargetByTag(tag:String):void {
		outTargetTag = tag;
		if (tag.Length > 0)
			outTarget = GameObject.FindWithTag(tag);
	}
	public function SetUpTargetByTag(tag:String):void {
		upTargetTag = tag;
		if (tag.Length > 0)
			upTarget = GameObject.FindWithTag(tag);
	}
	
	private function DeltaTime():void {
		if (currentTime < 0)
			currentTime = Time.realtimeSinceStartup;
		deltaTime = Time.realtimeSinceStartup - currentTime;
		currentTime = Time.realtimeSinceStartup;
		
		if (deltaTime > Time.maximumDeltaTime)
			deltaTime = Time.maximumDeltaTime;
	}
	
	/*
	public void SetDownTarget(GameObject target) {
		downTargetTag = tag;
		downTarget = target;
	}
	public void SetOutTarget(GameObject target) {
		outTargetTag = tag;
		outTarget = target;
	}
	public void SetUpTarget(GameObject target) {
		upTargetTag = tag;
		upTarget = target;
	}
	*/
}